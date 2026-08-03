'use server';

import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { z } from 'zod';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { appendOrderToSheet, syncAllOrdersToSheet } from '@/lib/sheets';
import { revalidatePath } from 'next/cache';

const CheckoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Delivery address is required'),
  notes: z.string().optional(),
  cartItems: z.array(
    z.object({
      productId: z.string(),
      name_fr: z.string(),
      name_ar: z.string(),
      quantity: z.number(),
      material: z.string(),
      price: z.number(),
    })
  ).min(1, 'Cart is empty'),
});

export async function createOrder(data: z.infer<typeof CheckoutSchema>) {
  try {
    // 1. Validate incoming data
    const validatedData = CheckoutSchema.parse(data);

    // 2. Connect to database
    await connectToDatabase();

    // 3. Calculate total
    const totalAmount = validatedData.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 4. Generate Order Number (e.g., RJ-1042)
    const count = await Order.countDocuments();
    const orderNumber = `RJ-${1000 + count}`;

    // 5. Create Order
    const newOrder = new Order({
      orderNumber,
      customer: {
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        city: validatedData.city,
        address: validatedData.address,
      },
      items: validatedData.cartItems.map((item) => ({
        product: item.productId,
        name_fr: item.name_fr,
        name_ar: item.name_ar,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      status: 'Pending',
      notes: validatedData.notes || '',
    });

    await newOrder.save();

    // Async full sync to Google Sheets (fire and forget)
    // This pushes the newly created order (and all others) and reapplies data validation
    syncOrdersAction().catch((err) => {
      console.error('Background task failed: Google Sheets Sync', err);
    });

    return { success: true, orderId: newOrder._id.toString() };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Failed to create order' };
  }
}

export async function syncOrdersAction() {
  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    
    await syncAllOrdersToSheet(orders);
    
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Manual sync failed:', error);
    return { success: false, error: error.message || 'Failed to sync orders' };
  }
}

export async function pullOrdersAction() {
  try {
    await connectToDatabase();
    
    // We need to import pullStatusesFromSheet, wait, let me check the import.
    // It's not imported yet, I'll use require or import it at the top.
    const { pullStatusesFromSheet } = await import('@/lib/sheets');
    
    const result = await pullStatusesFromSheet();
    if (!result.success) {
      throw new Error('Pull failed');
    }

    if (result.updates && result.updates.length > 0) {
      // Bulk update orders
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bulkOps = result.updates.map((update: any) => ({
        updateOne: {
          filter: { orderNumber: update.orderNumber },
          update: { $set: { status: update.status } }
        }
      }));

      await Order.bulkWrite(bulkOps);
    }
    
    revalidatePath('/admin/orders');
    return { success: true, updatedCount: result.updates?.length || 0 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Manual pull failed:', error);
    return { success: false, error: error.message || 'Failed to pull orders from Sheets' };
  }
}

export async function updateOrderStatus(orderId: string, formData: FormData) {
  try {
    const status = formData.get('status') as string;
    await connectToDatabase();
    await Order.findByIdAndUpdate(orderId, { status });
    
    // Trigger sync in background to update Google Sheets immediately
    syncOrdersAction().catch(console.error);
    
    revalidatePath('/admin/orders');
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    return { success: false, error: error.message };
  }
}

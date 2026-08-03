import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { pullStatusesFromSheet } from '@/lib/sheets';
import { Order } from '@/models/Order';
import { revalidatePath } from 'next/cache';
import { syncOrdersAction } from '@/actions/order';

// This function can run for a maximum of 60 seconds on Vercel Hobby
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Optional: Add a simple secret token check to prevent unauthorized triggering
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    
    // 1. Pull changes from sheets (e.g. manual status updates by owner)
    const result = await pullStatusesFromSheet();
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Failed to pull statuses' }, { status: 500 });
    }

    if (result.updates && result.updates.length > 0) {
      // Bulk update orders in MongoDB
      const bulkOps = result.updates.map((update: any) => ({
        updateOne: {
          filter: { orderNumber: update.orderNumber },
          update: { $set: { status: update.status } }
        }
      }));

      await Order.bulkWrite(bulkOps);
    }
    
    // 2. Push all orders to Sheets to ensure consistency and re-apply formatting
    await syncOrdersAction();
    
    revalidatePath('/admin/orders');
    
    return NextResponse.json({ 
      success: true, 
      updatedCount: result.updates?.length || 0 
    });
  } catch (error: any) {
    console.error('Cron job sync failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

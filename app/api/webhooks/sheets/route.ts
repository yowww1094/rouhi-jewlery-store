import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderNumber, status, secretToken } = body;

    // Security Check: Verify the secret token
    const expectedToken = process.env.SHEETS_WEBHOOK_SECRET;
    if (!expectedToken || secretToken !== expectedToken) {
      console.error('Webhook unauthorized attempt', { orderNumber });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orderNumber || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to database and update the order
    await connectToDatabase();
    
    // Allowed statuses validation
    const allowedStatuses = ['Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber: orderNumber.toString() }, // Ensure string comparison
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found in database' }, { status: 404 });
    }

    console.log(`Webhook: Order ${orderNumber} status updated to ${status} from Google Sheets.`);

    return NextResponse.json({ success: true, order: updatedOrder.orderNumber, newStatus: updatedOrder.status });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// Handle GET requests (in case Google Sheets redirects or defaults to GET)
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is active. Please send a POST request with the correct payload.' 
  }, { status: 405 });
}

// Handle CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

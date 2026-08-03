import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name_fr: string;
  name_ar: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: string; // 'COD'
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Delivered' | 'Cancelled';
  syncedToSheets: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      notes: { type: String },
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name_fr: { type: String, required: true },
        name_ar: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'COD' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    syncedToSheets: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

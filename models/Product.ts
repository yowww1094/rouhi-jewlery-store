import mongoose, { Schema, Document, Model } from 'mongoose';
import './Category';

export interface IProduct extends Document {
  sku?: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  categories?: mongoose.Types.ObjectId[];
  targetAudience: string;
  material: string; // e.g. "Or 18k", "Argent 925"
  price: number;
  discountPrice?: number;
  stock: number;
  isCollection: boolean;
  isGift: boolean;
  images: string[];
  isFeatured: boolean; // Toggled in Admin & synced to filter Homepage Featured Products
  isActive: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    sku: { type: String },
    name_fr: { type: String, required: true },
    name_ar: { type: String, required: true },
    description_fr: { type: String, required: true },
    description_ar: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    targetAudience: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
    material: { type: String, enum: ['Gold', 'Silver'], default: 'Gold' },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, default: 1 },
    isCollection: { type: Boolean, default: false },
    isGift: { type: Boolean, default: false },
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name_fr: string;
  name_ar: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name_fr: { type: String, required: true },
    name_ar: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreSettings extends Document {
  contactInfo: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StoreSettingsSchema: Schema<IStoreSettings> = new Schema(
  {
    contactInfo: {
      phone: { type: String, default: '+212 6 61 23 45 67' },
      whatsapp: { type: String, default: 'https://wa.me/212661234567' },
      email: { type: String, default: 'contact@rouhijewelry.ma' },
      address: { type: String, default: 'Quartier Gauthier, Casablanca, Maroc\nAgdal, Rabat, Maroc' },
      instagram: { type: String, default: 'https://instagram.com' },
      facebook: { type: String, default: 'https://facebook.com' },
    },
  },
  { timestamps: true }
);

export const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);

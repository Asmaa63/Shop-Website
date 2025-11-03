// models/Wishlist.ts
import mongoose, { Schema, models } from "mongoose";

const wishlistSchema = new Schema({
  userId: { type: String, required: true },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      originalPrice: Number,
      image: String,
      category: String,
      discount: Number,
    },
  ],
});

export const Wishlist = models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

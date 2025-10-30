"use client";
import { create } from "zustand";

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Review) => void;
  getProductReviews: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  
  addReview: (review) =>
    set((state) => ({
      reviews: [...state.reviews, review],
    })),
  
  getProductReviews: (productId) =>
    get().reviews.filter((r) => r.productId === productId),

  getAverageRating: (productId) => {
    const productReviews = get().reviews.filter((r) => r.productId === productId);
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return total / productReviews.length;
  },
}));

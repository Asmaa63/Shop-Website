"use client";
import { useState } from "react";
import { useReviewStore } from "@/store/reviewStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { addReview, getProductReviews, getAverageRating } = useReviewStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");

  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "" || name.trim() === "") {
      toast.error("Please fill all fields and select a rating.");
      return;
    }

    addReview({
      id: Date.now().toString(),
      productId,
      name,
      rating,
      comment,
      date: new Date().toISOString(),
    });

    toast.success("Review added successfully!");
    setRating(0);
    setComment("");
    setName("");
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h2>

      {/* Average Rating */}
      <div className="flex items-center gap-2 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-gray-700 font-semibold">
          {averageRating > 0 ? averageRating.toFixed(1) : "No reviews yet"}
        </span>
      </div>

      {/* Add Review Form */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            className="border border-gray-300 rounded-lg px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Write your review..."
            className="border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex gap-2 items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i + 1)}
                className={`w-6 h-6 cursor-pointer ${
                  (hoverRating || rating) > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-gray-700">{rating > 0 ? `${rating} stars` : ""}</span>
          </div>

          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
          >
            Submit Review
          </Button>
        </div>
      </div>

      {/* Review List */}
      <div>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800">{rev.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(rev.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

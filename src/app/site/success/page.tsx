"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    const shippingAddress = localStorage.getItem("shippingAddress");

    if (cartItems && shippingAddress) {
      const parsedCart = JSON.parse(cartItems);
      const parsedAddress = JSON.parse(shippingAddress);

      // احسبي إجمالي المبلغ
      const totalAmount = parsedCart.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );

      // بيانات الطلب
      const orderData = {
        items: parsedCart,
        shippingAddress: parsedAddress,
        totalAmount,
        status: "Pending",
        createdAt: new Date(),
      };

      // ابعتي الطلب إلى الـ API
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Order saved successfully ✅:", data);
          // امسحي البيانات من localStorage
          localStorage.removeItem("cartItems");
          localStorage.removeItem("shippingAddress");
        })
        .catch((err) => console.error("Error saving order:", err));
    }
  }, []);

  return (
    <div className="text-center text-white py-20">
      <h1 className="text-4xl font-bold mb-4">🎉 Order Placed Successfully!</h1>
      <p className="text-gray-300 mb-6">
        Your order has been placed and will be processed soon.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl"
      >
        Back to Home
      </button>
    </div>
  );
}

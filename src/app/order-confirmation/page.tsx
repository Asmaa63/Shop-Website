'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 bg-gray-50">
      <motion.div
        className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-lg text-center border-t-4 border-indigo-500"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-6xl text-green-500 mb-6">🎉</div>

        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Thank you for your purchase. We are preparing your order.
        </p>

        {orderId ? (
          <div className="bg-indigo-50 p-4 rounded-xl mb-6 border border-indigo-200">
            <p className="text-sm font-medium text-indigo-700">
              Your Order ID:
            </p>
            <p className="text-2xl font-bold text-indigo-900">#{orderId}</p>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-xl mb-6 border border-yellow-200">
            <p className="text-sm font-medium text-yellow-700">
              Confirmation received. Order ID could not be displayed. Check your email.
            </p>
          </div>
        )}

        <div className="space-y-3 mt-8">
          <Button
            onClick={() => (window.location.href = '/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 font-semibold text-lg"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => (window.location.href = '/account/orders')}
            variant="outline"
            className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-50"
          >
            View My Orders
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

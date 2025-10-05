'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="container mx-auto py-20 text-center">
      <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-xl text-gray-700 mb-8">Thank you for your order.</p>

      {sessionId && (
        <p className="text-sm text-gray-500 mb-10">
          Your payment has been confirmed. Session ID: {sessionId}
        </p>
      )}

      <Button onClick={() => (window.location.href = '/account/orders')}>
        View Order Status
      </Button>
      <Button
        variant="link"
        onClick={() => (window.location.href = '/')}
        className="ml-4"
      >
        Continue Shopping
      </Button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

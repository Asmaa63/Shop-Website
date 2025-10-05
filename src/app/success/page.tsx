// File: app/payment-success/page.tsx

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore'; 
import { toast, Toaster } from 'sonner';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');

    // Get the actions from the store
    const { addOrder, clearCart } = useCartStore(state => ({
        addOrder: state.addOrder,
        clearCart: state.clearCart,
    }));

    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [orderId, setOrderId] = useState<number | null>(null);

    useEffect(() => {
        if (!sessionId) {
            // If there's no session ID, redirect home after a short delay
            setVerificationStatus('failed');
            setTimeout(() => router.replace('/'), 3000);
            return;
        }

        const finalizeOrder = async () => {
            setVerificationStatus('loading');
            
            try {
                // IMPORTANT: Call your backend API to verify the payment using the sessionId.
                const response = await fetch(`/api/payment/confirm?sessionId=${sessionId}`, {
                    method: 'POST',
                });
                const result = await response.json();

                if (response.ok && result.order) {
                    // 1. Save the verified order to the local store
                    addOrder(result.order); 
                    
                    // 2. Clear the cart
                    clearCart();
                    
                    setOrderId(result.order.id);
                    setVerificationStatus('success');
                    toast.success('Order finalized and cart cleared!');

                    // Redirect to the dedicated confirmation page after store update
                    router.replace(`/order-confirmation?orderId=${result.order.id}`);

                } else {
                    setVerificationStatus('failed');
                    toast.error(result.message || 'Order verification failed.');
                }
            } catch (error) {
                console.error('Error during order finalization:', error);
                setVerificationStatus('failed');
                toast.error('An error occurred during order processing.');
            }
        };

        finalizeOrder();
        
    }, [sessionId, addOrder, clearCart, router]);


    // --- RENDERING LOGIC ---

    if (verificationStatus === 'loading') {
        return (
            <div className="container mx-auto py-20 text-center">
                <Loader2 className="h-10 w-10 text-indigo-500 mx-auto mb-4 animate-spin" />
                <h1 className="text-2xl font-semibold text-gray-800">Verifying Payment...</h1>
                <p className="text-gray-500 mt-2">Please do not close this window.</p>
            </div>
        );
    }
    
    if (verificationStatus === 'failed') {
         return (
            <div className="container mx-auto py-20 text-center">
                <AlertTriangle className="h-24 w-24 text-red-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4">Verification Failed</h1>
                <p className="text-xl text-gray-700 mb-8">
                    We could not confirm your payment. Your cart has been preserved.
                </p>
                <Button 
                    onClick={() => router.push('/checkout')} 
                    className="bg-red-600 hover:bg-red-700"
                >
                    Try Checkout Again
                </Button>
            </div>
        );
    }

    // Since we use router.replace, this success state is typically skipped,
    // but included for completeness and initial success display before redirect.
    return (
        <div className="container mx-auto py-20 text-center">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Success! Redirecting...</h1>
            <p className="text-xl text-gray-700 mb-8">Your order is being confirmed.</p>
            
            <Button onClick={() => router.push('/')}>
                Go Home
            </Button>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <>
            <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                <PaymentSuccessContent />
            </Suspense>
            <Toaster position="top-center" />
        </>
    );
}
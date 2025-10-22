import type { Metadata } from 'next';
// ✅ SEO METADATA FOR PAYMENT SUCCESS PAGE
// ----------------------------------------------------
// Since this is a critical transaction page, we optimize the title
// for confirmation, even though it's not a primary SEO target.
export const metadata: Metadata = {
    title: "Order Received! | Payment Successful - Exclusive Store",
    description: "Your payment has been successfully processed and your order is confirmed. You will be redirected to your detailed order confirmation page shortly.",
    keywords: ["payment successful", "order received", "checkout complete", "order confirmation"],
};

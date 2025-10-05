import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

// Initialize Stripe with the secret key and let it default to the latest version
// configured in your Stripe dashboard to avoid TypeScript version conflicts.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // apiVersion: '2024-06-20', // Removed explicit version to resolve TypeScript error
});

export default stripe;
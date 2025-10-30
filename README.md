# 🛍️ ShopEC E-Commerce Platform

A full-stack e-commerce platform built with Next.js 15, featuring a complete admin dashboard, customer shopping interface, and secure payment processing via Stripe.

## ✨ Features

### Customer Features
- 🏠 Modern responsive storefront
- 🔍 Product browsing and search
- 🛒 Shopping cart functionality
- ❤️ Wishlist management
- 👤 User account management
- 📦 Order tracking and history
- 💳 Secure checkout with Stripe
- 📍 Multiple shipping addresses
- 📱 Fully responsive design

### Admin Features
- 📊 Comprehensive dashboard
- 📦 Product management (CRUD operations)
- 👥 User management
- 🛍️ Order management and tracking
- 💬 Customer messages/inquiries
- ⚙️ Settings and configuration
- 📈 Analytics and reporting

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js v4
- **Payment:** Stripe
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Stripe account (test keys)
- Gmail account (for email notifications)
- Google OAuth credentials (optional)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd exclusive-ecommerce
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# ========================================================
# EMAIL SERVICE
# ========================================================
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@exclusive.com

# ========================================================
# DATABASE (MongoDB)
# ========================================================
MONGODB_URI=your-mongodb-connection-string

# ========================================================
# AUTHENTICATION (NextAuth.js)
# ========================================================
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ========================================================
# PAYMENT (Stripe - Test Keys)
# ========================================================
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# ========================================================
# ADMIN LOGIN
# ========================================================
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=your-secure-password
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
exclusive-ecommerce/
├── app/
│   ├── admin/              # Admin dashboard routes
│   │   ├── home/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── users/
│   │   ├── messages/
│   │   └── settings/
│   ├── site/               # Customer-facing routes
│   │   ├── shop/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   └── product/
│   └── api/                # API routes
│       ├── products/
│       ├── orders/
│       ├── users/
│       ├── payment/
│       └── webhook/
├── components/             # Reusable components
├── lib/                    # Utilities and configurations
├── models/                 # MongoDB schemas
├── public/                 # Static assets
├── styles/                 # Global styles
└── types/                  # TypeScript types
```

## 🌐 Routes Overview

### Customer Routes
- `/site` - Home page
- `/site/shop` - Product catalog
- `/site/product/[id]` - Product details
- `/site/cart` - Shopping cart
- `/site/checkout` - Checkout process
- `/site/account` - User dashboard
- `/site/account/orders` - Order history
- `/site/account/settings` - Account settings
- `/site/login` - User login
- `/site/register` - User registration

### Admin Routes
- `/admin` - Admin dashboard home
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/messages` - Customer inquiries
- `/admin/settings` - Platform settings
- `/admin/login` - Admin login

## 🔐 Authentication

The platform supports multiple authentication methods:

1. **Email/Password** - Traditional authentication
2. **Google OAuth** - Social login (optional)
3. **NextAuth.js** - Secure session management

### Admin Access
- URL: `/admin/login`
- Default credentials are set in `.env.local`
- Change default credentials before production deployment

## 💳 Payment Integration

Stripe is integrated for payment processing:

1. **Test Mode**: Uses test keys by default
2. **Webhook**: Configure webhook endpoint for order updates
3. **Supported**: Credit cards, digital wallets

### Stripe Webhook Setup
```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## 📧 Email Configuration

Email notifications are sent via SMTP (Gmail):

1. Enable 2-factor authentication on Gmail
2. Generate an App Password
3. Add credentials to `.env.local`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

**Important:** Update these environment variables for production:
- `NEXTAUTH_URL` - Your production domain
- `NEXT_PUBLIC_VERCEL_URL` - Your production domain
- `STRIPE_SECRET_KEY` - Live Stripe key
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret

## 🔒 Security Notes

- ⚠️ **Never commit `.env.local`** to version control
- 🔑 Change default admin credentials immediately
- 🛡️ Use strong passwords for all services
- 🔐 Enable 2FA where available
- 📝 Regularly update dependencies
- 🚨 Use live Stripe keys only in production

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check documentation in `/docs`

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- Stripe for payment processing
- All open-source contributors

---

**Built with ❤️ using Next.js 15**
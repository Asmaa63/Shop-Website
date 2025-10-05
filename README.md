# 🛍️ Exclusive E-Commerce Platform

## 🌟 Overview

This is a modern, full-stack **E-commerce Platform** built for high performance and an exceptional user experience. Utilizing the robustness of **Next.js** and the efficiency of **TypeScript**, the project features complete user authentication, global state management, and a component-driven design powered by **Shadcn UI** primitives.

It is designed as a scalable solution for a dynamic online shop, ready to handle product listings, user accounts, and secure transactions.

---

**🚀 Live Demo:** [https://shop-website-bay.vercel.app/](https://shop-website-bay.vercel.app/)

---

## ✨ Key Features

* **Full User Authentication:** Secure sign-up, login, and session management using **NextAuth.js**.
* **State Management:** Global state handling with **Zustand** for complex application data.
* **Data Validation:** Form validation and schema definition using **Zod** and **React Hook Form**.
* **MongoDB Integration:** Persistent and scalable data storage using **MongoDB**.
* **Modern UI/UX:** Built with **Tailwind CSS** and **Shadcn UI** primitives for a clean, responsive, and accessible interface.
* **Animated Interactions:** Enhanced user experience with fluid animations powered by **Framer Motion**.
* **Transaction/User Feedback:** Toast notifications and alerts managed by **Sonner**.

## 📁 Project Structure

The project follows the standard Next.js App Router structure, enhanced with dedicated directories for components, services, and state management logic.

## 📁 Project Structure

The project follows the standard Next.js App Router structure, enhanced with dedicated directories for components, services, and state management logic.

├── public/                       # Static assets (images, fonts, favicons)
├── src/
│   ├── app/                      # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)/               # Grouped routes for authentication (login, signup)
│   │   ├── api/                  # API Routes (Next.js backend)
│   │   ├── [product_slug]/       # Dynamic product pages
│   │   ├── layout.tsx            # Global layout structure
│   │   └── page.tsx              # Home page
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Shadcn UI primitives (Button, Card, Input, etc.)
│   │   └── global/               # Larger components (Header, Footer, Cart)
│   ├── lib/                      # Helper functions and utilities
│   │   ├── utils.ts              # Utility functions (e.g., for tailwind-merge)
│   │   └── validation/           # Zod schemas for validation
│   ├── providers/                # Context and Providers (e.g., AuthProvider, QueryClientProvider)
│   ├── hooks/                    # Custom React Hooks
│   ├── store/                    # Zustand store definitions for global state
│   ├── types/                    # TypeScript type definitions (interfaces, types)
│   └── styles/                   # Global styles and Tailwind configuration
├── .env.local                    # Environment variables (MUST be created locally)
├── next.config.js                # Next.js configuration
├── package.json                  # Project dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration

## 🛠️ Technology Stack & Dependencies 
The project leverages a robust and modern stack, focusing on security, performance, and developer experience.

### Core Technologies

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15+** | The React framework for server-side rendering (SSR), routing, and API endpoints. |
| **Language** | **TypeScript** | Enhances code quality and reliability with static typing. |
| **Styling** | **Tailwind CSS** | Utility-first framework for rapid and responsive custom styling. |
| **Database** | **MongoDB** | A NoSQL database for flexible and scalable data storage. |

### Major Dependencies

| Purpose | Tool / Library | Key Use |
| :--- | :--- | :--- |
| **Authentication** | **NextAuth.js** | Handles secure user authentication, sessions, and social logins. |
| **Database Adapter** | **`@next-auth/mongodb-adapter`** | Connects NextAuth.js to the MongoDB database. |
| **State Management** | **Zustand** | A fast, simple, and scalable state management solution. |
| **Form Handling** | **`react-hook-form`** & **`@hookform/resolvers`** | Manages form state, validation, and submission with high performance. |
| **Schema Validation** | **Zod** | TypeScript-first schema declaration and validation library. |
| **UI Components** | **`@radix-ui/*` (Shadcn UI)** | Accessible, unstyled component primitives for building custom interfaces (e.g., Dialog, Dropdown, Select, Slider). |
| **Animations** | **Framer Motion** | A production-ready animation library for React. |
| **Utility Icons** | **lucide-react** | A large collection of beautiful, community-driven SVG icons. |
| **Security** | **bcryptjs** | Used for hashing passwords securely. |
| **Email Service** | **nodemailer** | Simplifies sending emails (e.g., for password resets or order confirmations). |
| **Fetching/Caching** | **`@tanstack/react-query`** | Manages server state, caching, and background data fetching. |
| **Toasts/Alerts** | **sonner** | Beautiful, accessible, and customizable toast component. |

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

* Node.js (LTS version recommended)
* A MongoDB connection string (e.g., from MongoDB Atlas or a local instance).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Asmaa63/Shop-Website.git](https://github.com/Asmaa63/Shop-Website.git)
    cd Shop-Website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env.local` in the root directory and add your environment variables, including your MongoDB connection URI and NextAuth secret.

    ```bash
    # NextAuth Configuration
    NEXTAUTH_SECRET="your_strong_secret_key"
    NEXTAUTH_URL="http://localhost:3000"

    # Database Configuration
    MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority"

    # Email Configuration (for Nodemailer)
    EMAIL_SERVER_USER="your_email_user"
    EMAIL_SERVER_PASSWORD="your_email_password"
    EMAIL_FROM="noreply@example.com"
    ```

### Running the Development Server

Start the application in development mode:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
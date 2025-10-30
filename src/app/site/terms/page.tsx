"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800 px-6 py-10 md:px-16 lg:px-32 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center w-full mb-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent"
      >
        Terms & Conditions
      </motion.h1>

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-lg rounded-2xl p-6 md:p-10 w-full max-w-3xl border border-gray-100"
      >
        <motion.p
          className="text-gray-700 leading-relaxed mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to <span className="font-semibold text-blue-600">ShopEase</span> — your trusted e-commerce platform for high-quality products and a seamless shopping experience.
        </motion.p>

        <motion.ul
          className="list-disc list-inside space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <li>
            By accessing or using our website, you agree to comply with these terms and all applicable laws.
          </li>
          <li>
            All products, descriptions, and prices are subject to change without prior notice.
          </li>
          <li>
            We reserve the right to refuse or cancel any order due to product availability or pricing errors.
          </li>
          <li>
            Your personal data is securely processed in accordance with our privacy policy.
          </li>
          <li>
            Unauthorized use of our content, trademarks, or logos is strictly prohibited.
          </li>
        </motion.ul>

        <motion.p
          className="mt-6 text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          By continuing to use <span className="font-semibold text-blue-600">ShopEase</span>, you acknowledge that you have read and agreed to these Terms & Conditions.
        </motion.p>
      </motion.div>

      {/* Footer Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 text-sm text-gray-500"
      >
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </motion.div>
    </div>
  );
}

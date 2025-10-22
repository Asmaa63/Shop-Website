"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";



export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unexpected error occurred. Please try again.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/site/login");
      } else {
        router.push("/site/account");
        router.refresh();
      }
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/site/account" });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side - Info Section */}
        <motion.div
          className="hidden lg:block"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]"
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg mb-10 text-blue-100 leading-relaxed">
              Create an account to access exclusive deals, faster checkout, and
              a personalized shopping experience.
            </p>
            <div className="space-y-5">
              {[
                "Fast & Secure Checkout",
                "Track Your Orders",
                "Exclusive Member Deals",
                "Personalized Experience",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                  <span className="text-lg">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 sm:p-12"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-8 text-center">
            <motion.h2
              className="text-3xl font-extrabold text-gray-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Create Your Account
            </motion.h2>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/site/login"
                className="font-semibold text-blue-600 hover:text-purple-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ opacity: { duration: 0.2 } }}
              >
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {[
              {
                id: "name",
                icon: <User className="h-5 w-5 text-gray-400" />,
                type: "text",
                placeholder: "Asmaa Sharf",
                label: "Full Name",
              },
              {
                id: "email",
                icon: <Mail className="h-5 w-5 text-gray-400" />,
                type: "email",
                placeholder: "you@gmail.com",
                label: "Email Address",
              },
              {
                id: "password",
                icon: <Lock className="h-5 w-5 text-gray-400" />,
                type: "password",
                placeholder: "Min. 6 characters",
                label: "Password",
              },
              {
                id: "confirmPassword",
                icon: <Lock className="h-5 w-5 text-gray-400" />,
                type: "password",
                placeholder: "Confirm your password",
                label: "Confirm Password",
              },
            ].map(({ id, icon, type, placeholder, label }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {icon}
                  </div>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    required
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                    placeholder={placeholder}
                  />
                </div>
              </motion.div>
            ))}

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-purple-600"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-purple-600"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.03]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-gray-300 rounded-xl shadow-sm bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.5 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09a8 8 0 010-4.18V7.07H2.18A11 11 0 001 12a11 11 0 001.18 4.93l3-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38a6.5 6.5 0 014.21 1.64l3.15-3.15A11 11 0 0012 1 11 11 0 002.18 7.07l3.66 2.84C6.7 7.3 9.1 5.38 12 5.38z"
                />
              </svg>
              Google
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

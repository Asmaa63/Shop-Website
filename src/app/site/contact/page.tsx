"use client";
import { motion } from "framer-motion";
import { Phone, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: ["+20 1065307167", "+20 1145678910"],
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@ShopEC.com.eg", "info@ShopEC.com.eg"],
    color: "bg-blue-100 text-blue-600",
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully!", {
        duration: 3000,
        style: {
          background: "linear-gradient(to right, #10b981, #34d399)",
          color: "#fff",
          fontWeight: "bold",
        },
      });

      reset();
    } catch {
      toast.error("Failed to send message. Please try again.", {
        duration: 3000,
        style: {
          background: "linear-gradient(to right, #ef4444, #f87171)",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm"
        >
          <Link
            href="/"
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold">Contact</span>
        </motion.div>
      </div>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have a question or need assistance? We&apos;re here to help! Reach
            out to us through any of the channels below.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mb-16 flex-wrap">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 w-80"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-16 h-16 rounded-full ${info.color} flex items-center justify-center mb-4 mx-auto`}
              >
                <info.icon className="w-8 h-8" />
              </motion.div>
              <h3 className="text-xl font-bold text-center mb-3">
                {info.title}
              </h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-600 text-center text-sm">
                  {detail}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
            <p className="text-gray-600 mb-6">
              Fill out the form below and we&apos;ll get back to you within 24
              hours
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input {...register("name")} placeholder="Your Name" className="h-12" />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Email Address"
                    className="h-12"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="Phone Number"
                    className="h-12"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  {...register("subject")}
                  placeholder="Subject"
                  className="h-12"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <Textarea
                  {...register("message")}
                  placeholder="Your Message"
                  rows={6}
                  className="resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl text-lg font-semibold"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.913723479766!2d31.482212874648787!3d30.04344351837485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458159b8ef4bfbf%3A0xfed341ca6b3d4d2c!2sNew%20Cairo%2C%20Cairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1696600000000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-red-500 to-pink-500 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Follow Us on Social Media</h2>
            <p className="text-lg opacity-90 mb-8">
              Stay connected and get the latest updates
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {["facebook", "twitter", "instagram", "linkedin", "youtube"].map(
                (social, index) => (
                  <motion.a
                    key={social}
                    href={`#${social}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-red-500 hover:shadow-lg transition-all duration-300"
                  >
                    <span className="text-2xl capitalize">{social[0]}</span>
                  </motion.a>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

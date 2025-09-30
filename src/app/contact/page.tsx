"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
    details: ["+1 (234) 567-8900", "+1 (234) 567-8901"],
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@exclusive.com", "info@exclusive.com"],
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Commerce Street", "New York, NY 10001"],
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"],
    color: "bg-purple-100 text-purple-600",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  
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
      // Send contact form data to API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });

      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm"
        >
          <Link href="/" className="text-gray-500 hover:text-red-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold">Contact</span>
        </motion.div>
      </div>

      {/* Header */}
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
            Have a question or need assistance? We&apos;re here to help! Reach out to us
            through any of the channels below.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-16 h-16 rounded-full ${info.color} flex items-center justify-center mb-4 mx-auto`}
              >
                <info.icon className="w-8 h-8" />
              </motion.div>
              <h3 className="text-xl font-bold text-center mb-3">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-600 text-center text-sm">
                  {detail}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Contact Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
            <p className="text-gray-600 mb-6">
              Fill out the form below and we&apos;ll get back to you within 24 hours
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input
                  {...register("name")}
                  placeholder="Your Name"
                  className="h-12"
                />
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
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
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
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
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

          {/* Map & Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Map */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-96">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Google Maps integration</p>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: "Frequently Asked Questions", href: "/faq" },
                  { label: "Shipping Information", href: "/shipping" },
                  { label: "Return Policy", href: "/returns" },
                  { label: "Track Your Order", href: "/track-order" },
                ].map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-150 transition-transform" />
                      <span className="font-medium group-hover:text-red-500 transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media Section */}
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
            <div className="flex justify-center gap-4">
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
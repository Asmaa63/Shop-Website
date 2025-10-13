"use client";

import { motion } from "framer-motion";
import { Users, ShoppingBag, DollarSign, Award, Target, Eye, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  {
    icon: ShoppingBag,
    value: "10.5k",
    label: "Active Sellers",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: DollarSign,
    value: "33k",
    label: "Monthly Product Sale",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    value: "45.5k",
    label: "Customers Active",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Award,
    value: "25k",
    label: "Annual Gross Sale",
    color: "bg-purple-100 text-purple-600",
  },
];

const team = [
  {
    name: "Tom Cruise",
    role: "Founder & Chairman",
    image: "/team/tom.jpg",
  },
  {
    name: "Emma Watson",
    role: "Managing Director",
    image: "/team/emma.jpg",
  },
  {
    name: "Will Smith",
    role: "Product Designer",
    image: "/team/will.jpg",
  },
];

const services = [
  {
    icon: "🚚",
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over EGP 340",
  },
  {
    icon: "🎧",
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
  },
  {
    icon: "✅",
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
  },
];

export default function AboutPage() {
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
          <span className="font-semibold">About</span>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Our Story
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Launched in 2015, Exclusive is South Asia&apos;s premier online shopping marketplace
              with an active presence in Bangladesh. Supported by a wide range of tailored
              marketing, data, and service solutions, Exclusive has 10,500 sellers and 300
              brands and serves 3 million customers across the region.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Exclusive has more than 1 Million products to offer, growing at a very fast pace.
              Exclusive offers a diverse assortment in categories ranging from consumer
              electronics to fashion and lifestyle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl p-12 aspect-square flex items-center justify-center">
              <ShoppingBag className="w-64 h-64 text-red-500" strokeWidth={1} />
            </div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-10 right-10 bg-white rounded-full p-4 shadow-lg"
            >
              <Heart className="w-8 h-8 text-red-500" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute bottom-10 left-10 bg-white rounded-full p-4 shadow-lg"
            >
              <Award className="w-8 h-8 text-yellow-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-full EGP{stat.color} flex items-center justify-center mb-4`}
                >
                  <stat.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-gradient-to-br from-red-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the world&apos;s most trusted and preferred e-commerce platform,
                revolutionizing online shopping worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Customer satisfaction, integrity, innovation, and sustainability are at
                the core of everything we do.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 text-lg">
            Dedicated professionals working to serve you better
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <Users className="w-32 h-32 text-gray-400" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <motion.a
                      whileHover={{ scale: 1.2 }}
                      href="#"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.2 }}
                      href="#"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.2 }}
                      href="#"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* Services Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-3xl p-8 shadow-lg text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-6xl mb-4"
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* CTA Section */}
<section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
  <div className="container mx-auto px-4 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-bold mb-6"
    >
      Ready to Transform Your Shopping Experience?
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-blue-100"
    >
      Join thousands of satisfied customers who trust us for their everyday
      needs. Shop smarter, live better.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 justify-center"
    >
      <Button
        size="lg"
        className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8"
      >
        Start Shopping
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8"
      >
        Learn More
      </Button>
    </motion.div>
  </div>
</section>
</div>
 );
}

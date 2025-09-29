"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Eye, Download, Truck, CheckCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const orders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "January 15, 2024",
    status: "delivered", // ✅ متوافقة مع type
    total: 129.99,
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 79.99, image: "🎧" },
      { name: "Phone Case", quantity: 2, price: 25.0, image: "📱" },
    ],
    tracking: "TRK1234567890",
  },
  {
    id: "ORD-2024-002",
    date: "January 10, 2024",
    status: "shipping", // ✅ برضه تمام
    total: 89.99,
    items: [{ name: "Smart Watch", quantity: 1, price: 89.99, image: "⌚" }],
    tracking: "TRK0987654321",
  },
  {
    id: "ORD-2024-003",
    date: "January 5, 2024",
    status: "processing",
    total: 199.99,
    items: [
      { name: "Laptop Stand", quantity: 1, price: 49.99, image: "💻" },
      { name: "Mechanical Keyboard", quantity: 1, price: 150.0, image: "⌨️" },
    ],
    tracking: null,
  },
  {
    id: "ORD-2023-045",
    date: "December 28, 2023",
    status: "cancelled",
    total: 45.99,
    items: [{ name: "USB Cable", quantity: 3, price: 15.33, image: "🔌" }],
    tracking: null,
  },
];

const statusConfig = {
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  shipping: {
    label: "In Transit",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Truck,
  },
  processing: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: X,
  },
};
type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  status: "delivered" | "shipping" | "processing" | "cancelled";
  total: number;
  items: OrderItem[];
  tracking: string | null;
};

export default function OrdersPage() {
    
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status === filter
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-wrap gap-3"
        >
          {[
            { value: "all", label: "All Orders", count: orders.length },
            { value: "delivered", label: "Delivered", count: orders.filter(o => o.status === "delivered").length },
            { value: "shipping", label: "Shipping", count: orders.filter(o => o.status === "shipping").length },
            { value: "processing", label: "Processing", count: orders.filter(o => o.status === "processing").length },
          ].map((item) => (
            <Button
              key={item.value}
              variant={filter === item.value ? "default" : "outline"}
              onClick={() => setFilter(item.value)}
              className="rounded-xl"
            >
              {item.label} ({item.count})
            </Button>
          ))}
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredOrders.map((order, index) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {order.id}
                          </h3>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <Badge
                          className={`${statusConfig[order.status as keyof typeof statusConfig].color} border-2 px-4 py-2 text-sm font-semibold flex items-center gap-2`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig[order.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-sm text-gray-700"
                          >
                            <span className="text-2xl">{item.image}</span>
                            <span className="flex-1">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-semibold">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking */}
                      {order.tracking && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                          <p className="font-mono font-semibold text-gray-800">
                            {order.tracking}
                          </p>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-gray-600 font-medium">Total Amount</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full rounded-xl gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      {order.status === "delivered" && (
                        <Button
                          variant="outline"
                          className="w-full rounded-xl gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </Button>
                      )}
                      {order.status === "shipping" && (
                        <Button
                          variant="outline"
                          className="w-full rounded-xl gap-2 text-blue-600 border-blue-200"
                        >
                          <Truck className="w-4 h-4" />
                          Track Order
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500">
                No orders match your selected filter
              </p>
            </motion.div>
          )}
        </div>

        {/* Order Details Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={statusConfig[selectedOrder.status as keyof typeof statusConfig].color}>
                      {statusConfig[selectedOrder.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  {selectedOrder.tracking && (
                    <div>
                      <p className="text-sm text-gray-500">Tracking</p>
                      <p className="font-mono text-sm">{selectedOrder.tracking}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: OrderItem, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-3xl">{item.image}</span>
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
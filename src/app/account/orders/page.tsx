// File: app/account/orders/page.tsx

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
// FIX 1: Import useCartStore and the Order type from your store
import { useCartStore, Order } from "@/store/cartStore";

// --- Configuration (No changes needed here) ---
const statusConfig = {
    // Note: If you want these to match the payment status codes, you might need to adjust them.
    // For now, we'll map the store status string to one of these:
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
    // Adding default status for items coming from the store if they use a different label
    'Pending': {
        label: "Pending",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: Clock,
    },
    'Processing Payment': {
        label: "Awaiting Payment",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: Clock,
    },
};

// FIX 2: Removed temporary Order/OrderItem types as they are now imported from '@/store/cartStore'

// Helper to get status keys for filtering
const statusKeys = Object.keys(statusConfig);

export default function OrdersPage() {
    // FIX 3: Fetch the real orders from the Zustand store
    const { orders: storeOrders } = useCartStore(state => ({
        orders: state.orders,
    }));
    
    // Reverse the array so the newest orders appear first
    const orders = [...storeOrders].reverse();

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filter, setFilter] = useState<string>("all");

    // The status in the store is a string, so we must check if it matches a key in statusConfig
    const filteredOrders = orders.filter((order) =>
        filter === "all" 
            ? true 
            : order.status.toLowerCase().includes(filter) || 
              (filter === 'processing' && order.status === 'Processing Payment') ||
              (filter === 'pending' && order.status === 'Pending')
    );
    
    // Helper to determine the config to use for rendering
    const getStatusConfig = (status: string) => {
        const key = status.toLowerCase().replace(/\s/g, '') as keyof typeof statusConfig;
        return statusConfig[key] || statusConfig['Pending']; // Default to Pending if unknown
    };


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
                        { value: "delivered", label: "Delivered", count: orders.filter(o => o.status.toLowerCase() === "delivered").length },
                        { value: "shipping", label: "Shipping", count: orders.filter(o => o.status.toLowerCase() === "shipping").length },
                        { value: "processing", label: "Processing / Payment", count: orders.filter(o => o.status.toLowerCase().includes("process") || o.status.toLowerCase().includes("pending")).length },
                        { value: "cancelled", label: "Cancelled", count: orders.filter(o => o.status.toLowerCase() === "cancelled").length },
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
                            const config = getStatusConfig(order.status);
                            const StatusIcon = config.icon;
                            
                            // Check if the order object structure matches what the component expects:
                            const orderTotal = (order.orderTotal || order.totalAmount || 0).toFixed(2);
                            const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });

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
                                                        Order #{order.id}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{orderDate}</p>
                                                </div>
                                                <Badge
                                                    className={`${config.color} border-2 px-4 py-2 text-sm font-semibold flex items-center gap-2`}
                                                >
                                                    <StatusIcon className="w-4 h-4" />
                                                    {config.label}
                                                </Badge>
                                            </div>

                                            {/* Items */}
                                            <div className="space-y-2 mb-4">
                                                {order.items.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-3 text-sm text-gray-700"
                                                    >
                                                        {/* NOTE: The item.image emoji property might not exist on the CartItem type */}
                                                        {/* You might need to adjust item.image based on your actual data */}
                                                        <span className="text-2xl">📦</span> 
                                                        <span className="flex-1">
                                                            {item.name} × {item.quantity}
                                                        </span>
                                                        <span className="font-semibold">
                                                            ${item.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Tracking (Assumed to be part of the full Order object if used) */}
                                            {/* {order.tracking && ( ... tracking UI ... )} */}

                                            {/* Total */}
                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <span className="text-gray-600 font-medium">Order Total</span>
                                                <span className="text-2xl font-bold text-blue-600">
                                                    ${orderTotal}
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
                                            {/* Conditional buttons can be re-enabled once full status lifecycle is known */}
                                            {/* {order.status === "delivered" && ( ... Invoice button ... )} */}
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
                                No orders match your selected filter.
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
                                        <p className="font-semibold">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <Badge className={getStatusConfig(selectedOrder.status).color}>
                                            {getStatusConfig(selectedOrder.status).label}
                                        </Badge>
                                    </div>
                                    {/* NOTE: Assuming tracking is not currently saved in the store Order object */}
                                    {/* {selectedOrder.tracking && ( ... tracking UI ... )} */}
                                </div>
                                
                                {/* Shipping Address (Adding this crucial detail) */}
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-indigo-700">Shipping To</h4>
                                    <p className="text-sm text-gray-700">{selectedOrder.shippingDetails.fullName}</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.shippingDetails.street}</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.zipCode}</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.shippingDetails.country}</p>
                                </div>


                                <div>
                                    <h4 className="font-semibold mb-3">Order Items</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <span className="text-3xl">📦</span>
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
                                            ${selectedOrder.orderTotal.toFixed(2)}
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
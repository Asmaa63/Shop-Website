"use client";
import { useEffect, useState } from "react";
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

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  image?: string;
};

type shippingAddress = {
  fullName: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone?: string;
};

type Order = {
  _id: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  shippingAddress: shippingAddress;
};

const statusConfig = {
  Pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-700 border-gray-200", 
    icon: Clock,
  },
  Processing: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
    icon: Clock,
  },
  Completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 border-green-200", 
    icon: CheckCircle,
  },
  Payment: {
    label: "Payment",
    color: "bg-blue-100 text-blue-700 border-blue-200", 
    icon: Clock,
  },
  Shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700 border-purple-200", 
    icon: Truck,
  },
  Delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
    icon: CheckCircle,
  },
  Cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200", 
    icon: X,
  },
};

const statusKeys = Object.keys(statusConfig);

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders", { cache: "no-store" });
                const data = await res.json();

                if (Array.isArray(data)) {
                    setOrders(data.reverse());
                } else if (Array.isArray(data.orders)) {
                    setOrders(data.orders.reverse());
                } else {
                    console.warn("Unexpected orders data format:", data);
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) =>
        filter === "all" 
            ? true 
            : order.status.toLowerCase().includes(filter) || 
              (filter === 'processing' && order.status === 'Processing Payment') ||
              (filter === 'pending' && order.status === 'Pending')
    );
    
    const getStatusConfig = (status: string) => {
        return statusConfig[status as keyof typeof statusConfig] || statusConfig["Pending"];
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-wrap gap-3"
                >
                    {[
                        { value: "all", label: "All Orders", count: orders.length },
                        { value: "completed", label: "Completed", count: orders.filter(o => o.status.toLowerCase().includes("complete")).length },
                        { value: "pending", label: "Pending", count: orders.filter(o => o.status.toLowerCase().includes("pending")).length },
                        { value: "processing", label: "Processing / Payment", count: orders.filter(o => o.status.toLowerCase().includes("process")).length },
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

                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredOrders.map((order, index) => {
                            const config = getStatusConfig(order.status);
                            const StatusIcon = config.icon;
                            // احسبي إجمالي المنتجات أولاً
const itemsTotal = order.items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

let shippingFee = 0;

if (itemsTotal > 0 && itemsTotal < 2000) {
  shippingFee = 70;
} else if (itemsTotal >= 2000 && itemsTotal < 3000) {
  shippingFee = 50;
} else if (itemsTotal >= 3000) {
  shippingFee = 0; // Free
}

const totalAmount = (itemsTotal + shippingFee).toFixed(2);


                            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });

                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                        Order #{order._id.slice(-8)}
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

                                            <div className="space-y-2 mb-4">
                                                {order.items.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-3 text-sm text-gray-700"
                                                    >
                                                        {item.imageUrl || item.image ? (
                                                            <img
                                                                src={item.imageUrl || item.image}
                                                                alt={item.name}
                                                                className="w-10 h-10 rounded-md object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-2xl">📦</span> 
                                                        )}
                                                        <span className="flex-1">
                                                            {item.name} × {item.quantity}
                                                        </span>
                                                        <span className="font-semibold text-blue-600">
                                                            EGP {item.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-4 border-t space-y-2">
  <div className="flex items-center justify-between text-gray-600 font-medium">
    <span>Items Total</span>
    <span>EGP {itemsTotal.toFixed(2)}</span>
  </div>

  <div className="flex items-center justify-between text-gray-600 font-medium">
    <span>Delivery Fee</span>
    <span>
      {shippingFee === 0 ? (
        <span className="text-green-600 font-semibold">Free</span>
      ) : (
        `EGP ${shippingFee.toFixed(2)}`
      )}
    </span>
  </div>

  <div className="flex items-center justify-between text-xl font-bold border-t pt-2">
    <span>Total Amount</span>
    <span className="text-blue-600">EGP {totalAmount}</span>
  </div>
</div>

                                        </div>

                                        <div className="flex flex-col gap-3 lg:w-48">
                                            <Button
                                                onClick={() => setSelectedOrder(order)}
                                                className="w-full rounded-xl gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </Button>
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

                <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Order Details</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID</p>
                                        <p className="font-semibold">#{selectedOrder._id.slice(-8)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <Badge className={getStatusConfig(selectedOrder.status).color}>
                                            {getStatusConfig(selectedOrder.status).label}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-indigo-700">Shipping To</h4>
                                    <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.fullName}</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.street}</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.country}</p>
                                    {selectedOrder.shippingAddress.phone && (
                                        <p className="text-sm text-gray-700 mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Order Items</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                            >
                                                {item.imageUrl || item.image ? (
                                                    <img
                                                        src={item.imageUrl || item.image}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded-md object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-3xl">📦</span>
                                                )}

                                                <div className="flex-1">
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold">EGP {item.price.toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-blue-600">
                                            EGP {selectedOrder.totalAmount.toFixed(2)}
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
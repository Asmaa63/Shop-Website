'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, Phone, Mail, MapPin, User, Package } from 'lucide-react';

interface OrderItem {
  name: string;
  image?: string;
  imageUrl?: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName?: string;
  email?: string;
  phone?: string;
  governorate?: string;
  city?: string;
  street?: string;
  village?: string;
  zipCode?: string;
  country?: string;
}

interface Order {
  _id: string;
  shippingAddress?: ShippingAddress;
  totalAmount: number;
  items: OrderItem[];
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/admin", { cache: "no-store" });
        const data = await res.json();

        const ordersArray = Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
          ? data.orders
          : [];

        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const orderId = order._id?.toLowerCase() || '';
        const customerName = order.shippingAddress?.fullName?.toLowerCase() || '';
        const phone = order.shippingAddress?.phone?.toLowerCase() || '';
        const email = order.shippingAddress?.email?.toLowerCase() || '';
        const status = order.status?.toLowerCase() || '';
        const itemNames = order.items?.map((item) => item.name.toLowerCase()).join(' ') || '';

        return (
          orderId.includes(query) ||
          customerName.includes(query) ||
          phone.includes(query) ||
          email.includes(query) ||
          status.includes(query) ||
          itemNames.includes(query)
        );
      });
    }

    if (selectedDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate === selectedDate;
      });
    }

    setFilteredOrders(filtered);
  }, [searchQuery, selectedDate, orders]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearDate = () => {
    setSelectedDate('');
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent('Hello! Regarding your order...');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}?subject=Regarding Your Order`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading orders...</p>
        </motion.div>
      </div>
    );
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await res.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <motion.div
      className="p-4 md:p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        Orders Management
      </motion.h1>

      <motion.div
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            ></motion.div>
            <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
              <div className="flex items-center gap-3">
                <Search className="text-indigo-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by ID, customer, phone, email, product, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-base"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={clearSearch}
                      className="text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="relative sm:w-64">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-30"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5,
              }}
            ></motion.div>
            <div className="relative bg-gradient-to-r from-pink-50 to-indigo-50 rounded-2xl p-4 border border-pink-200">
              <div className="flex items-center gap-3">
                <Calendar className="text-pink-600 w-5 h-5" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 text-base cursor-pointer"
                />
                <AnimatePresence>
                  {selectedDate && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={clearDate}
                      className="text-gray-500 hover:text-pink-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <motion.p
          className="text-center text-gray-600 mt-3 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
          {selectedDate && (
            <span className="ml-2 text-pink-600">
              on {new Date(selectedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          )}
        </motion.p>
      </motion.div>

      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl"
        >
          <div className="text-7xl mb-4">🔍</div>
          <p className="text-gray-600 text-lg font-medium">No orders found matching your search</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms or date filter</p>
        </motion.div>
      ) : (
        <motion.div
          className="overflow-x-auto rounded-xl border border-gray-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">#</th>
                <th className="px-4 py-4 text-left font-semibold">Order ID</th>
                <th className="px-4 py-4 text-left font-semibold">Customer</th>
                <th className="px-4 py-4 text-left font-semibold">Contact</th>
                <th className="px-4 py-4 text-left font-semibold">Total (EGP)</th>
                <th className="px-4 py-4 text-left font-semibold">Items</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Created</th>
                <th className="px-4 py-4 text-left font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-black transition-all group"
                  >
                    <td className="py-4 px-4">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-semibold text-white"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {index + 1}
                      </motion.div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs font-medium text-indigo-700 group-hover:text-indigo-900 transition-colors">
                        {order._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium">{order.shippingAddress?.fullName || 'Unknown'}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        {order.shippingAddress?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">{order.shippingAddress.phone}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleWhatsApp(order.shippingAddress?.phone || '')}
                              className="ml-1 text-green-600 hover:text-green-700"
                              title="Send WhatsApp"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-green-700">
                      {(() => {
                        const itemsTotal = order.items?.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        ) || 0;

                        let shippingFee = 0;
                        if (itemsTotal > 0 && itemsTotal < 2000) {
                          shippingFee = 70;
                        } else if (itemsTotal >= 2000 && itemsTotal < 3000) {
                          shippingFee = 50;
                        } else if (itemsTotal >= 3000) {
                          shippingFee = 0;
                        }

                        const totalAmount = itemsTotal + shippingFee;

                        return (
                          <div>
                            <p className="text-base font-bold text-blue-700">
                              {totalAmount.toFixed(2)}
                            </p>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-4">
                      {order.items?.length > 0 ? (
                        <>
                          <div className="flex flex-col gap-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <motion.div
                                key={idx}
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                <img
                                  src={item.image || item.imageUrl || '/placeholder.png'}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded-lg shadow-sm"
                                />
                                <span className="text-sm font-medium">
                                  {item.name} <span className="text-gray-600">({item.quantity})</span>
                                </span>
                              </motion.div>
                            ))}
                          </div>
                          {order.items.length > 2 && (
                            <motion.button
                              onClick={() => setSelectedOrder(order)}
                              className="mt-2 text-indigo-600 text-sm font-semibold hover:text-indigo-800 hover:underline transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              +{order.items.length - 2} more items
                            </motion.button>
                          )}
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`border rounded-lg px-2 py-1 text-sm font-medium text-white 
                          ${
                            order.status === 'Pending' ? 'bg-gray-400' :
                            order.status === 'Processing' ? 'bg-yellow-500' :
                            order.status === 'Completed' ? 'bg-green-600' :
                            order.status === 'Payment' ? 'bg-blue-500' :
                            order.status === 'Shipped' ? 'bg-indigo-500' :
                            order.status === 'Delivered' ? 'bg-emerald-600' :
                            order.status === 'Cancelled' ? 'bg-red-600' :
                            'bg-gray-300'
                          }`}
                      >
                        <option value="Pending" className="text-gray-700">Pending</option>
                        <option value="Processing" className="text-gray-700">Processing</option>
                        <option value="Completed" className="text-gray-700">Completed</option>
                        <option value="Payment" className="text-gray-700">Payment</option>
                        <option value="Shipped" className="text-gray-700">Shipped</option>
                        <option value="Delivered" className="text-gray-700">Delivered</option>
                        <option value="Cancelled" className="text-gray-700">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedOrder(order)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 transition-all"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              <motion.h2
                className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Order Details
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div
                  className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-lg text-gray-800">Customer Information</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600 text-sm">Full Name:</span>
                      <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Phone:</span>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                        {selectedOrder.shippingAddress?.phone && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleWhatsApp(selectedOrder.shippingAddress?.phone || '')}
                            className="text-green-600 hover:text-green-700"
                            title="Send WhatsApp"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                          </motion.button>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Email:</span>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 break-all text-sm">{selectedOrder.shippingAddress?.email || 'N/A'}</p>
                        {selectedOrder.shippingAddress?.email && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEmail(selectedOrder.shippingAddress?.email || '')}
                            className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                            title="Send Email"
                          >
                            <Mail className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-lg text-gray-800">Shipping Address</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600 text-sm">Governorate:</span>
                      <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress?.governorate || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">City:</span>
                      <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress?.city || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Street Address:</span>
                      <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress?.street || 'N/A'}</p>
                    </div>
                    {selectedOrder.shippingAddress?.village && (
                      <div>
                        <span className="text-gray-600 text-sm">Village/Area:</span>
                        <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress.village}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-600 text-sm">Zip Code:</span>
                        <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress?.zipCode || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Country:</span>
                        <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress?.country || 'Egypt'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-lg text-gray-800">Order Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <p className="font-mono font-semibold text-indigo-700">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className={`font-semibold inline-block px-2 py-1 rounded-lg text-white text-xs ${
                      selectedOrder.status === 'Pending' ? 'bg-gray-400' :
                      selectedOrder.status === 'Processing' ? 'bg-yellow-500' :
                      selectedOrder.status === 'Completed' ? 'bg-green-600' :
                      selectedOrder.status === 'Payment' ? 'bg-blue-500' :
                      selectedOrder.status === 'Shipped' ? 'bg-indigo-500' :
                      selectedOrder.status === 'Delivered' ? 'bg-emerald-600' :
                      selectedOrder.status === 'Cancelled' ? 'bg-red-600' :
                      'bg-gray-300'
                    }`}>
                      {selectedOrder.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Order Date:</span>
                    <p className="font-semibold text-gray-800">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    {(() => {
                      const itemsTotal = selectedOrder.items.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      );
                      let shippingFee = 0;
                      if (itemsTotal > 0 && itemsTotal < 2000) {
                        shippingFee = 70;
                      } else if (itemsTotal >= 2000 && itemsTotal < 3000) {
                        shippingFee = 50;
                      }
                      const totalAmount = itemsTotal + shippingFee;

                      return (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-700">
                            Items: <span className="font-semibold">{itemsTotal.toFixed(2)} EGP</span>
                          </p>
                          <p className="text-xs text-gray-700">
                            Delivery:{' '}
                            {shippingFee === 0 ? (
                              <span className="text-green-600 font-semibold">Free</span>
                            ) : (
                              <span className="font-semibold">{shippingFee.toFixed(2)} EGP</span>
                            )}
                          </p>
                          <p className="text-base font-bold text-green-700 border-t pt-1">
                            {totalAmount.toFixed(2)} EGP
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Items ({selectedOrder.items.length})</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedOrder.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-lg transition-all border border-indigo-100"
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <img
                      src={item.image || item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-base">{item.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: <span className="font-semibold text-indigo-700">{item.quantity}</span>
                      </p>
                      <p className="text-sm text-green-700 font-bold mt-1">EGP {item.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Subtotal: <span className="font-semibold text-gray-700">EGP {(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
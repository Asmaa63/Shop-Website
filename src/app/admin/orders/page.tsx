'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar } from 'lucide-react';

interface OrderItem {
  name: string;
  image?: string;
  imageUrl?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
  };
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
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/admin", { cache: "no-store" });
      const data = await res.json();
      console.log("Fetched orders:", data);

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
        const status = order.status?.toLowerCase() || '';
        const itemNames = order.items?.map((item) => item.name.toLowerCase()).join(' ') || '';

        return (
          orderId.includes(query) ||
          customerName.includes(query) ||
          phone.includes(query) ||
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
    setShowCalendar(false);
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

    // ✅ تأكدي من الاستجابة قبل قراءة JSON
    if (!res.ok) {
      throw new Error("Failed to update order");
    }

    const updatedOrder = await res.json(); // ✅ استهلك الـ body مرة واحدة بس

    // ✅ حدّث الواجهة مباشرة
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === id ? { ...order, status: updatedOrder.status } : order
      )
    );

    console.log("✅ Order updated successfully:", updatedOrder);
  } catch (error) {
    console.error("❌ Error updating order:", error);
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
        className="mb-6 space-y-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
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
                placeholder="Search by ID, customer, phone, product, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-lg"
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

        <div className="relative">
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
                className="flex-1 bg-transparent border-none outline-none text-gray-800 text-lg cursor-pointer"
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
                <th className="px-4 py-4 text-left font-semibold">Phone</th>
                <th className="px-4 py-4 text-left font-semibold">Total (EGP)</th>
                <th className="px-4 py-4 text-left font-semibold">Items</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Created</th>
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
                                              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-semibold"
                                              whileHover={{ scale: 1.1, rotate: 360 }}
                                              transition={{ duration: 0.5 }}
                                            >
                                              {index + 1}
                                            </motion.div>
                                          </td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm font-medium text-indigo-700 group-hover:text-indigo-900 transition-colors">
                        {order._id}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium">{order.shippingAddress?.fullName || 'Unknown'}</td>
                    <td className="px-4 py-4 text-gray-700">{order.shippingAddress?.phone || '—'}</td>
                    <td className="px-4 py-4 font-bold text-green-700">
  {(() => {
    // احسبي إجمالي المنتجات
    const itemsTotal = order.items?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;

    // احسبي التوصيل
    let shippingFee = 0;
    if (itemsTotal > 0 && itemsTotal < 2000) {
      shippingFee = 70;
    } else if (itemsTotal >= 2000 && itemsTotal < 3000) {
      shippingFee = 50;
    } else if (itemsTotal >= 3000) {
      shippingFee = 0;
    }

    // احسبي المجموع الكلي
    const totalAmount = itemsTotal + shippingFee;

    // رجّعيه في JSX
    return (
      <div>
        {/* <p className="text-sm text-gray-800">
          Items: <span className="font-semibold text-indigo-700">{itemsTotal.toFixed(2)} EGP</span>
        </p>
        <p className="text-sm text-gray-800">
          Delivery:{' '}
          {shippingFee === 0 ? (
            <span className="font-semibold text-green-600">Free</span>
          ) : (
            <span className="font-semibold text-indigo-700">{shippingFee.toFixed(2)} EGP</span>
          )}
        </p> */}
        <p className="text-base font-bold text-blue-700  border-gray-200 pt-1 mt-1">
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
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto"
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

              <motion.div
                className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <p className="font-mono font-semibold text-indigo-700">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <p className="font-semibold text-indigo-700">{selectedOrder.shippingAddress?.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-semibold text-indigo-700">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
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
      <p className="text-sm text-gray-700">
        Items: <span className="font-semibold">{itemsTotal.toFixed(2)} EGP</span>
      </p>
      <p className="text-sm text-gray-700">
        Delivery:{' '}
        {shippingFee === 0 ? (
          <span className="text-green-600 font-semibold">Free</span>
        ) : (
          <span className="font-semibold">{shippingFee.toFixed(2)} EGP</span>
        )}
      </p>
      <p className="text-lg font-bold text-green-700 border-t pt-1">
        Total: {totalAmount.toFixed(2)} EGP
      </p>
    </div>
  );
})()}

                  </div>
                </div>
              </motion.div>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Items ({selectedOrder.items.length})</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedOrder.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-lg transition-all border border-indigo-100"
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <img
                      src={item.image || item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: <span className="font-semibold text-indigo-700">{item.quantity}</span>
                      </p>
                      <p className="text-sm text-green-700 font-bold mt-1">EGP {item.price}</p>
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
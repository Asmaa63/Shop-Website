'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, User, Clock, Trash2, Eye, Search, X, MessageSquare } from 'lucide-react';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(data.messages || []);
        setFilteredMessages(data.messages || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    let filtered = messages;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((msg) => {
        return (
          msg.name.toLowerCase().includes(query) ||
          msg.email.toLowerCase().includes(query) ||
          msg.phone.toLowerCase().includes(query) ||
          msg.subject.toLowerCase().includes(query) ||
          msg.message.toLowerCase().includes(query)
        );
      });
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((msg) => msg.status === filterStatus);
    }

    setFilteredMessages(filtered);
  }, [searchQuery, filterStatus, messages]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update message");

      const updatedMessage = await res.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, status: updatedMessage.status } : msg
        )
      );
    } catch (error) {
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      setSelectedMessage(null);
    } catch (error) {
    }
  };

  const handleReplyEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const handleReplyWhatsApp = (phone: string) => {
    const formatted = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${formatted}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading messages...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Contact Messages
      </motion.h1>

      <motion.div className="mb-6 space-y-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
          <div className="flex items-center gap-3">
            <Search className="text-indigo-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-base"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {['all', 'unread', 'read', 'replied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && ` (${messages.filter(m => m.status === status).length})`}
            </button>
          ))}
        </div>
      </motion.div>

      {filteredMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl"
        >
          <Mail className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No messages found</p>
        </motion.div>
      ) : (
        <motion.div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">#</th>
                <th className="px-4 py-4 text-left font-semibold">Name</th>
                <th className="px-4 py-4 text-left font-semibold">Email</th>
                <th className="px-4 py-4 text-left font-semibold">Phone</th>
                <th className="px-4 py-4 text-left font-semibold">Subject</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Date</th>
                <th className="px-4 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredMessages.map((msg, index) => (
                  <motion.tr
                    key={msg._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-b hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all"
                  >
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-semibold text-white">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">{msg.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{msg.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{msg.phone}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-800">{msg.subject}</td>
                    <td className="px-4 py-4">
                      <select
                        value={msg.status}
                        onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                        className={`border rounded-lg px-2 py-1 text-sm font-medium text-white ${
                          msg.status === 'unread' ? 'bg-gray-400' :
                          msg.status === 'read' ? 'bg-blue-500' :
                          'bg-green-600'
                        }`}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Message Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-gray-600">Name</span>
                    </div>
                    <p className="font-semibold text-indigo-700">{selectedMessage.name}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Email</span>
                    </div>
                    <p className="font-semibold text-purple-700 text-sm break-all">{selectedMessage.email}</p>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-pink-600" />
                      <span className="text-sm text-gray-600">Phone</span>
                    </div>
                    <p className="font-semibold text-pink-700">{selectedMessage.phone}</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Date</span>
                    </div>
                    <p className="font-semibold text-green-700 text-sm">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Subject</p>
                  <p className="font-bold text-lg text-gray-800">{selectedMessage.subject}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Message</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => handleReplyEmail(selectedMessage.email)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                     Reply via Email
                  </button>

                  <button
                    onClick={() => handleReplyWhatsApp(selectedMessage.phone)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                     Reply via WhatsApp
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedMessage._id, 'replied')}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Mark as Replied
                  </button>

                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

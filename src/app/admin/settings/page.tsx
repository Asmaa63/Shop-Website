"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  PlusCircle,
  Edit,
  Save,
  X,
  Trash2,
  Loader2,
  User,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

interface Admin {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
  isSuperAdmin?: boolean;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
}

const SUPER_ADMIN_EMAIL = "asmaasharf123@gmail.com";

export default function SettingsPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState<Admin>({
    name: "",
    email: "",
    password: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admins");
      const data = await res.json();
      const adminsWithSuperFlag = Array.isArray(data)
        ? data.map((a: Admin) => ({
            ...a,
            isSuperAdmin: a.email === SUPER_ADMIN_EMAIL,
          }))
        : [];
      setAdmins(adminsWithSuperFlag);
    } catch {
      toast.error("Failed to load admins");
    }
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (admin) {
      setAdmin({ ...admin, [e.target.name]: e.target.value });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!admin || !admin.email) {
      toast.error("Admin data is incomplete.");
      return;
    }

    const isPasswordChange = !!passwordForm.newPassword;

    if (isPasswordChange && !passwordForm.currentPassword) {
      toast.error("Please enter your current password to set a new one.");
      return;
    }

    setLoading(true);

    const updatePayload = {
      email: admin.email,
      name: admin.name,
      ...(isPasswordChange && {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    };

    try {
      const res = await fetch(`/api/admins/${encodeURIComponent(admin.email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      localStorage.setItem(
        "adminData",
        JSON.stringify({ ...admin, name: admin.name })
      );
      setEditing(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      fetchAdmins();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (email === SUPER_ADMIN_EMAIL) {
      toast.error("Cannot delete Super Admin account!");
      setConfirmDelete(null);
      return;
    }

    try {
      const res = await fetch(`/api/admins/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete admin");
      }
      
      toast.success("Admin deleted successfully");
      setConfirmDelete(null);
      fetchAdmins();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unexpected error occurred");
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("All fields are required");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to add admin");
      }
      
      toast.success("New admin added successfully");
      setShowAddModal(false);
      setNewAdmin({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!admin)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <Loader2 className="animate-spin mr-2" size={24} /> Loading...
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <Toaster position="bottom-right" />

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
      >
        <div className="flex items-center mb-6">
          <User className="mr-3 text-purple-600" size={32} />
          <h2 className="text-3xl font-extrabold text-gray-800">My Profile</h2>
          {admin.email === SUPER_ADMIN_EMAIL && (
            <div className="ml-auto flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              <Shield size={16} />
              Super Admin
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={admin.name}
              onChange={handleAdminChange}
              disabled={!editing}
              className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${
                editing
                  ? "border-blue-500 focus:ring-2 focus:ring-blue-500"
                  : "border-gray-300 bg-gray-100"
              } text-gray-800 outline-none disabled:opacity-70`}
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={admin.email}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-500 outline-none"
            />
          </div>

          {editing && (
            <div className="pt-4 space-y-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-blue-600">
                Change Password (Optional)
              </h4>

              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Required if changing password"
                    className="w-full px-4 py-3 rounded-xl border border-blue-400 focus:ring-2 focus:ring-blue-500 text-gray-800 outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-blue-400 focus:ring-2 focus:ring-blue-500 text-gray-800 outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition duration-300 shadow-md"
              >
                <Edit className="mr-2" size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition duration-300 disabled:opacity-50 shadow-md"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
                  ) : (
                    <Save className="mr-2" size={18} />
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                    });
                  }}
                  className="flex items-center px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl font-semibold transition duration-300 shadow-md"
                >
                  <X className="mr-2" size={18} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Admins List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Current Admins
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-semibold transition duration-300 shadow-md"
          >
            <PlusCircle size={18} /> Add New Admin
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full border-collapse text-left text-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="p-4 rounded-tl-xl">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 hidden sm:table-cell">Created At</th>
                <th className="p-4 text-center rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins
                .filter((a) => a)
                .map((a, index) => (
                  <tr
                    key={`${a.email}-${index}`}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-2">
                        {a.name}
                        {a.isSuperAdmin && (
                          <span title="Super Admin">
                            <Shield size={16} className="text-orange-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{a.email}</td>
                    <td className="p-4 text-gray-500 hidden sm:table-cell">
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      {a.email !== admin.email && !a.isSuperAdmin ? (
                        <button
                          onClick={() => setConfirmDelete(a.email)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition duration-300 shadow-sm"
                        >
                          <Trash2 size={16} className="inline-block mr-1" /> Delete
                        </button>
                      ) : a.isSuperAdmin && a.email !== admin.email ? (
                        <span className="text-xs text-gray-400 italic">Protected</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Admin</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-gray-800 outline-none"
                    placeholder="Admin name"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-gray-800 outline-none"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showNewAdminPassword ? "text" : "password"}
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-gray-800 outline-none pr-12"
                      placeholder="Secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showNewAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddAdmin}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
                  ) : (
                    <PlusCircle className="mr-2" size={18} />
                  )}
                  {loading ? "Adding..." : "Add Admin"}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAdmin({ name: "", email: "", password: "" });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-semibold transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this admin? This action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition duration-300"
                >
                  <Trash2 className="mr-2" size={18} />
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-semibold transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
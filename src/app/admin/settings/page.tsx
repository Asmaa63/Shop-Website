"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { PlusCircle, Edit, Save, X, Trash2, Loader2, User, Eye, EyeOff } from "lucide-react";

// Define a basic interface for Admin data
interface Admin {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

// Initial state for the profile form (admin)
const initialAdminState: Admin = {
  name: "",
  email: "",
};

// State for password fields (separate from admin state for current password verification)
interface PasswordForm {
    currentPassword: string;
    newPassword: string;
}


export default function SettingsPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState<Admin>({ name: "", email: "", password: "" });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({ currentPassword: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);


  useEffect(() => {
    // 1. Load current admin from localStorage
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
    // 2. Fetch all admins for the table
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admins");
      const data = await res.json();
      // Ensure data is an array before setting state
      setAdmins(Array.isArray(data) ? data : []);
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
    
    // Check if the user is trying to change password or not
    const isPasswordChange = !!passwordForm.newPassword;

    if (isPasswordChange && !passwordForm.currentPassword) {
        toast.error("Please enter your current password to set a new one.");
        return;
    }

    setLoading(true);

    // Prepare data for the API call
    const updatePayload = {
        name: admin.name,
        // Only include password fields if a new password is provided
        ...(isPasswordChange && { 
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword 
        }),
    };

    try {
      const res = await fetch(`/api/admins/${admin.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      
      // Update local admin data (only name can be changed directly, password is not stored locally)
      localStorage.setItem("adminData", JSON.stringify({ ...admin, name: admin.name }));

      setEditing(false);
      setPasswordForm({ currentPassword: '', newPassword: '' }); // Clear passwords after successful save
      fetchAdmins();
    } catch (err: unknown) {
  if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("An unexpected error occurred");
  }
}
finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    try {
      const res = await fetch(`/api/admins/${email}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete admin");
      toast.success("Admin deleted successfully");
      setConfirmDelete(null);
      fetchAdmins();
    }catch (err: unknown) {
  if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("An unexpected error occurred");
  }
}
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("All fields are required");
      return;
    }
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add admin");
      setAdmins((prev) => [...prev, data.admin]);
      toast.success("New admin added successfully");
      setShowAddModal(false);
      setNewAdmin({ name: "", email: "", password: "" });
    } catch (err: unknown) {
  if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("An unexpected error occurred");
  }
}

  };

  // Loading state check
  if (!admin)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="animate-spin mr-2" size={24} /> Loading...
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      <Toaster position="bottom-right" />
      
      {/* My Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto mt-10 bg-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/20"
      >
        <div className="flex items-center mb-6">
            <User className="mr-3 text-purple-400" size={32} />
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              My Profile
            </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={admin.name}
              onChange={handleAdminChange}
              disabled={!editing}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border transition duration-300 ${
                editing ? "border-blue-500 focus:ring-2 focus:ring-blue-500" : "border-gray-700"
              } text-white placeholder-gray-400 outline-none disabled:opacity-70`}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={admin.email}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 outline-none"
            />
          </div>
          
          {/* Password Fields (Only visible when editing) */}
          {editing && (
              <>
                <div className="pt-4 space-y-4 border-t border-white/10">
                    <h4 className="text-lg font-semibold text-blue-400">Change Password (Optional)</h4>
                    
                    {/* Current Password */}
                    <div>
                        <label className="block text-gray-300 font-medium mb-1">Current Password</label>
                        <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder="Required to save changes if changing password"
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 outline-none pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-gray-300 font-medium mb-1">New Password</label>
                         <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordForm.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter new password (optional)"
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 outline-none pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
              </>
          )}


          <div className="flex justify-end gap-4 pt-4">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold transition duration-300 shadow-md"
              >
                <Edit className="mr-2" size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-xl font-semibold transition duration-300 disabled:opacity-50 shadow-md"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setPasswordForm({ currentPassword: '', newPassword: '' }); // Clear password fields on cancel
                  }}
                  className="flex items-center px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold transition duration-300 shadow-md"
                >
                  <X className="mr-2" size={18} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Current Admins Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-4xl mx-auto mt-10 bg-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Current Admins
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl font-semibold transition duration-300 shadow-md"
            >
              <PlusCircle size={18} /> Add New Admin
            </button>
        </div>

        <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-700/50 text-gray-300 uppercase text-sm">
                  <th className="p-4 rounded-tl-xl">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 hidden sm:table-cell">Created At</th>
                  <th className="p-4 text-center rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* FIX: Filter out null/undefined elements just in case, solving the TypeError */}
                {admins.filter(a => a).map((a, index) => (
                  <tr
    key={`${a.email}-${index}`}
    className="border-b border-white/10 hover:bg-white/10 transition duration-150"
  >
                   <td className="p-4 font-medium">{a.name}</td>
                    <td className="p-4 text-gray-300 text-sm">{a.email}</td>
                    <td className="p-4 text-gray-400 hidden sm:table-cell">
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-center">
                      {/* You cannot delete your own admin account */}
                      {a.email !== admin.email && (
                        <button
                          onClick={() => setConfirmDelete(a.email)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition duration-300 shadow-sm"
                        >
                          <Trash2 size={16} className="inline-block mr-1" /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </motion.div>

      {/* --- Modals --- */}

      {/* 1. Add New Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-purple-500 shadow-3xl text-white"
          >
            <h3 className="text-2xl font-bold mb-6 text-purple-400">Add New Admin</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-300 text-sm mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Admin Name"
                      value={newAdmin.name}
                      onChange={(e) =>
                        setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="Admin Email"
                      value={newAdmin.email}
                      onChange={(e) =>
                        setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-sm mb-1">Password</label>
                    <div className="relative">
  <input
    type={showNewAdminPassword ? "text" : "password"}
    placeholder="Password"
    value={newAdmin.password}
    onChange={(e) =>
      setNewAdmin((prev) => ({ ...prev, password: e.target.value }))
    }
    className="w-full p-3 pr-12 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition"
  />
  <button
    type="button"
    onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
  >
    {showNewAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-red-500"
          >
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Confirm Deletion
            </h3>
            <p className="mb-6">
                Are you sure you want to delete the admin with email: <span className="font-semibold">{confirmDelete}</span>?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex items-center px-5 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold transition shadow-md"
              >
                <Trash2 size={16} className="mr-1" /> Confirm Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-xl font-semibold transition shadow-md"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

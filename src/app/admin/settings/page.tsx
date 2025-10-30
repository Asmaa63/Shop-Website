"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

interface Admin {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

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

    const isPasswordChange = !!passwordForm.newPassword;

    if (isPasswordChange && !passwordForm.currentPassword) {
      toast.error("Please enter your current password to set a new one.");
      return;
    }

    setLoading(true);

    const updatePayload = {
      name: admin.name,
      ...(isPasswordChange && {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
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
    try {
      const res = await fetch(`/api/admins/${email}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete admin");
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
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unexpected error occurred");
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
      >
        <div className="flex items-center mb-6">
          <User className="mr-3 text-purple-600" size={32} />
          <h2 className="text-3xl font-extrabold text-gray-800">My Profile</h2>
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
            <>
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
            </>
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
                    <td className="p-4 font-medium">{a.name}</td>
                    <td className="p-4 text-gray-600 text-sm">{a.email}</td>
                    <td className="p-4 text-gray-500 hidden sm:table-cell">
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      {a.email !== admin.email && (
                        <button
                          onClick={() => setConfirmDelete(a.email)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition duration-300 shadow-sm"
                        >
                          <Trash2
                            size={16}
                            className="inline-block mr-1"
                          />{" "}
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

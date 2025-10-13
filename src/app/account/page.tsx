"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Mail, Package, Settings, LogOut, Edit2, Save, X, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrdersPage from "./orders/page";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    orderUpdates: true,
    promotional: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
      });
      loadUserProfile();
    }
  }, [session]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch("/api/users/profile");
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
  setIsLoading(true);
  try {
    const response = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) throw new Error("Failed to update profile");

    await update({
      ...session,
      user: {
        ...session?.user,
        name: profileData.name,
        email: profileData.email,
      },
    });

    toast({
      title: "Success!",
      description: "Your profile has been updated successfully.",
    });

    await loadUserProfile(); // ✅ refresh data from server
    setIsEditing(false); // ✅ go back to normal view
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update profile. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      toast({
        title: "Success!",
        description: "Your password has been changed successfully.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordDialog(false);
    } catch (error) {
  const message =
    error instanceof Error ? error.message : "Failed to change password.";
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/delete-account", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {session.user?.name}!</h1>
              <p className="text-blue-100 mt-1">{session.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile} disabled={isLoading} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          loadUserProfile();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        className="max-w-md"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg max-w-md">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 font-medium">{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </Label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg max-w-md">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 font-medium">{profileData.email}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        placeholder="+20 1065307167"
                        className="max-w-md"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg max-w-md">
                        <span className="text-gray-900 font-medium">
                          {profileData.phone || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && <OrdersPage />}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                    <Button onClick={() => setShowPasswordDialog(true)} variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>

                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded"
                          checked={notifications.email}
                          onChange={(e) =>
                            setNotifications({ ...notifications, email: e.target.checked })
                          }
                        />
                        <span className="text-gray-700">Email notifications</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded"
                          checked={notifications.orderUpdates}
                          onChange={(e) =>
                            setNotifications({ ...notifications, orderUpdates: e.target.checked })
                          }
                        />
                        <span className="text-gray-700">Order updates</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded"
                          checked={notifications.promotional}
                          onChange={(e) =>
                            setNotifications({ ...notifications, promotional: e.target.checked })
                          }
                        />
                        <span className="text-gray-700">Promotional emails</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-500 mb-4">Danger Zone</h3>
                    <Button
                      onClick={() => setShowDeleteDialog(true)}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-500 text-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="current">Current Password</Label>
              <Input
                id="current"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="new">New Password</Label>
              <Input
                id="new"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input
                id="confirm"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
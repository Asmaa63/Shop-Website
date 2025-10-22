"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react"; // Import useSession
import {
  Settings,
  User,
  Lock,
  Bell,
  Mail,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming AvatarImage is available
import { toast } from "sonner";

// --- Types for Profile Data (must match your API response) ---
type ProfileData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  bio?: string;
};

// Profile form inputs
type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
};

// Password form inputs
type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    sms: true,
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset, // 🛑 Added reset function
  } = useForm<ProfileFormData>();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
  } = useForm<PasswordFormData>();

  // --- useEffect to Fetch User Data and Populate Form ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data: ProfileData = await res.json();
        setUserData(data);

        // Split name for firstName and lastName
        const nameParts = data.name?.split(" ") || [];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || ""; // Handle names with more than two parts

        // 🛑 Populate the form with real data using reset()
        reset({
          firstName: firstName,
          lastName: lastName,
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "", // Must ensure 'bio' is returned by your API
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [reset]); // Dependency array includes reset

  // --- Handlers ---
  const onProfileSubmit = (data: ProfileFormData) => {
    toast.success("Profile updated successfully!");
    console.log("Profile Data:", data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    toast.success("Password changed successfully!");
    console.log("Password Data:", data);
  };
  
  
  // Get initials for Avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  const initials = userData?.name ? getInitials(userData.name) : (session?.user?.name ? getInitials(session.user.name) : "AC");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-700">Loading Settings...</h1>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-200 rounded-xl shadow-inner  md:shadow-lg">
  {/* 💡 TabsTrigger: تعديل الخط والحجم وإضافة انتقال سلس */}
  <TabsTrigger 
    value="profile" 
    className="rounded-lg gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200 md:text-base md:py-2 "
  >
    <User className="w-4 h-4" /> 
    Profile
  </TabsTrigger>
  
  <TabsTrigger 
    value="security" 
    className="rounded-lg gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200 md:text-base md:py-2"
  >
    <Lock className="w-4 h-4" />
    Security
  </TabsTrigger>
  
  <TabsTrigger 
    value="notifications" 
    className="rounded-lg gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200 md:text-base md:py-2"
  >
    <Bell className="w-4 h-4" />
    Notifications
  </TabsTrigger>
  
  <TabsTrigger 
    value="privacy" 
    className="rounded-lg gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-200 md:text-base md:py-2"
  >
    <Shield className="w-4 h-4" />
    Privacy
  </TabsTrigger>
</TabsList>
          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Personal Information
              </h2>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      {/* 🛑 Use image from fetched data */}
                      <AvatarImage 
  src={userData?.image || session?.user?.image || undefined} 
  alt={userData?.name || session?.user?.name || "User Avatar"} 
/>
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {/* <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button> */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{userData?.name || "Update Name"}</h3>
                    {/* <p className="text-sm text-gray-500 mb-2">
                      JPG, PNG or GIF, max 5MB
                    </p>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Upload Photo
                    </Button> */}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...registerProfile("firstName")} className="mt-2 h-11 rounded-lg" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...registerProfile("lastName")}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {/* 🛑 Removed defaultValue to allow reset() to control value */}
                    <Input
                      id="email"
                      type="email"
                      {...registerProfile("email")}
                      className="mt-2 h-11 rounded-lg"
                      disabled // Email is usually not editable in the profile
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {/* 🛑 Removed defaultValue to allow reset() to control value */}
                    <Input
                      id="phone"
                      {...registerProfile("phone")}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    {/* 🛑 Removed defaultValue to allow reset() to control value */}
                    <textarea
                      id="bio"
                      {...registerProfile("bio")}
                      rows={4}
                      className="mt-2 w-full rounded-lg border-2 border-gray-200 p-3 focus:border-blue-500 focus:outline-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </Button>
              </form>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                Security Settings
              </h2>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      {...registerPassword("currentPassword")}
                      className="h-11 rounded-lg pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...registerPassword("newPassword")}
                        className="h-11 rounded-lg pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword("confirmPassword")}
                      className="mt-2 h-11 rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Password requirements:</strong> At least 8 characters,
                    including uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Update Password
                </Button>
              </form>

              {/* Two-Factor Authentication */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-bold mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Enable 2FA</p>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-600" />
                Notification Preferences
              </h2>

              <div className="space-y-6">
                {[
                  {
                    key: "orderUpdates",
                    title: "Order Updates",
                    description: "Get notified about your order status",
                    icon: "📦",
                  },
                  {
                    key: "promotions",
                    title: "Promotions & Deals",
                    description: "Receive exclusive offers and discounts",
                    icon: "🎁",
                  },
                  {
                    key: "newsletter",
                    title: "Newsletter",
                    description: "Weekly updates about new products",
                    icon: "📧",
                  },
                  {
                    key: "sms",
                    title: "SMS Notifications",
                    description: "Receive text messages for urgent updates",
                    icon: "📱",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked: boolean) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={() => toast.success("Notification preferences saved!")}
                size="lg"
                className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 gap-2"
              >
                <Save className="w-5 h-5" />
                Save Preferences
              </Button>
            </motion.div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Privacy & Data
              </h2>

              <div className="space-y-6">
                <div className="p-5 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold mb-2">Data Collection</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Control how we collect and use your data
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analytics & Performance</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Personalized Recommendations</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Download Your Data</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Request a copy of all your data in our system
                  </p>
                  <Button variant="outline" className="rounded-lg border-blue-300">
                    Request Data Export
                  </Button>
                </div>

                <div className="p-5 bg-red-50 rounded-xl border-2 border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-800 mb-4">
                    Permanently delete your account and all associated data. This action
                    cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    className="rounded-lg bg-red-600 hover:bg-red-700"
                  >
                    Delete My Account
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    type: "home",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    name: "John Doe",
    phone: "+1 (555) 987-6543",
    street: "456 Business Ave, Suite 200",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    type: "home",
    isDefault: false,
  });

  const addressTypeConfig = {
    home: { icon: Home, label: "Home", color: "text-blue-600 bg-blue-100" },
    work: { icon: Briefcase, label: "Work", color: "text-purple-600 bg-purple-100" },
    other: { icon: MapPin, label: "Other", color: "text-gray-600 bg-gray-100" },
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    setFormData({ type: "home", isDefault: false });
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.street || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingAddress) {
      setAddresses(addresses.map(addr =>
        addr.id === editingAddress.id ? { ...formData as Address, id: addr.id } : addr
      ));
      toast.success("Address updated successfully!");
    } else {
      const newAddress: Address = {
        ...formData as Address,
        id: Date.now().toString(),
      };
      setAddresses([...addresses, newAddress]);
      toast.success("Address added successfully!");
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success("Address deleted successfully!");
  };

  const setDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    toast.success("Default address updated!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Saved Addresses
            </h1>
            <p className="text-gray-600">Manage your delivery addresses</p>
          </div>
          <Button
            onClick={openAddDialog}
            size="lg"
            className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </Button>
        </motion.div>

        {/* Addresses Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {addresses.map((address, index) => {
              const TypeIcon = addressTypeConfig[address.type].icon;
              
              return (
                <motion.div
                  key={address.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 },
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-2xl shadow-lg p-6 EGP{
                    address.isDefault ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl EGP{addressTypeConfig[address.type].color} flex items-center justify-center`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {addressTypeConfig[address.type].label}
                        </h3>
                        {address.isDefault && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                            <Check className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditDialog(address)}
                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(address.id)}
                        className="w-9 h-9 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold text-gray-800">{address.name}</p>
                    <p className="text-gray-600">{address.phone}</p>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                  </div>

                  {/* Set Default Button */}
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      onClick={() => setDefault(address.id)}
                      className="w-full rounded-xl border-2"
                    >
                      Set as Default
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MapPin className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No Addresses Saved
            </h3>
            <p className="text-gray-500 mb-6">
              Add your first address to get started
            </p>
            <Button onClick={openAddDialog} size="lg" className="rounded-full gap-2">
              <Plus className="w-5 h-5" />
              Add Address
            </Button>
          </motion.div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              {/* Address Type */}
              <div>
                <Label className="mb-3 block">Address Type</Label>
                <RadioGroup
  value={formData.type}
  onValueChange={(value: Address["type"]) =>
    setFormData({ ...formData, type: value })
  }
  className="flex gap-4"
>

                  {(Object.keys(addressTypeConfig) as Array<keyof typeof addressTypeConfig>).map((type) => {
                    const Icon = addressTypeConfig[type].icon;
                    return (
                      <label
                        key={type}
                        className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all EGP{
                          formData.type === type
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <RadioGroupItem value={type} id={type} />
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{addressTypeConfig[type].label}</span>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Name & Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 h-11 rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 h-11 rounded-lg"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.street || ""}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="mt-2 h-11 rounded-lg"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              {/* City, State, ZIP */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-2 h-11 rounded-lg"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state || ""}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-2 h-11 rounded-lg"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode || ""}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="mt-2 h-11 rounded-lg"
                    placeholder="10001"
                  />
                </div>
              </div>

              {/* Set as Default */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <Label htmlFor="isDefault" className="cursor-pointer text-sm">
                  Set as default address
                </Label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 h-12 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {editingAddress ? "Update Address" : "Save Address"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
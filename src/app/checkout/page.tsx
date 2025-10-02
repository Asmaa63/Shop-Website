"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, Lock, MapPin, User, Mail, Phone, Building, CheckCircle, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

// --- Zod Schema: Base fields are required, payment details are optional at schema level ---
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  
  // Payment fields are optional in the schema
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// --- Interface to replace 'any' for orderDetails ---
interface OrderDetails {
  orderId: string;
  userId: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  paymentMethod: string;
  // Combines shipping form data and the payment method
  shippingInfo: CheckoutFormData & { paymentMethod: string };
  walletPhone?: string;
  status: string;
}

// --- Payment Methods Data ---
const paymentMethodsData = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard, description: "Pay securely with Visa, MasterCard.", iconClasses: "text-blue-600" },
  { id: "cod", label: "Cash on Delivery", icon: Package, description: "Pay when you receive your order.", iconClasses: "text-green-600" },
  { id: "wallet", label: "Mobile Wallet (Vodafone, Orange, Etisalat)", icon: Phone, description: "Transfer via mobile wallet app.", iconClasses: "text-red-600" },
];

// --- Mock User Data (Replace with actual user data from Auth) ---
const mockUser = {
  id: 'user-123',
  email: 'user@example.com', 
};

// --- Mock Email Sending Function (Now correctly typed) ---
const sendConfirmationEmail = async (userEmail: string, orderDetails: OrderDetails) => {
  console.log(`[Email Mock] Sending confirmation to: ${userEmail}`);
  console.log(`[Email Mock] Order ID: ${orderDetails.orderId}`);
  
  // Simulate success
  return true; 
};


export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletPhone, setWalletPhone] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  // Effect to redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);
  
  if (items.length === 0) {
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    // --- Conditional Validation Logic ---
    if (paymentMethod === "card") {
      const cardFields = ["cardNumber", "cardName", "expiryDate", "cvv"] as const;
      for (const field of cardFields) {
        if (!data[field] || data[field]?.length === 0) {
          toast.error(`Please provide your ${field} details for card payment.`);
          return;
        }
      }
    } else if (paymentMethod === "wallet") {
        if (walletPhone.length < 10) {
            toast.error("Please enter a valid mobile wallet phone number (at least 10 digits).");
            return;
        }
    }

    setIsProcessing(true);
    
    // --- 1. Prepare Order Details (Now typed as OrderDetails) ---
    const orderDetails: OrderDetails = {
        orderId: 'ORD-' + Date.now(),
        userId: mockUser.id,
        products: items.map(item => ({ 
          id: item.id, 
          name: item.name, 
          price: item.price, 
          quantity: item.quantity 
        })),
        total: total,
        paymentMethod: paymentMethod,
        shippingInfo: { ...data, paymentMethod },
        walletPhone: paymentMethod === 'wallet' ? walletPhone : undefined,
        status: 'Pending',
    };
    
    // --- 2. Simulate Payment/Order Submission ---
    await new Promise((resolve) => setTimeout(resolve, 1500)); 

    // --- 3. Send Confirmation Email (Mock) ---
    const emailSent = await sendConfirmationEmail(mockUser.email, orderDetails);

    if (emailSent) {
        // --- 4. Show Success Toast and Clear Cart ---
        clearCart();
        toast.success(
            <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span className="font-semibold">Order Placed Successfully!</span>
            </div>,
            {
                description: `Your Order #${orderDetails.orderId} is confirmed. A detailed email was sent to ${mockUser.email}. We will contact you soon.`,
                duration: 6000,
            }
        );
        
        // --- 5. Navigate to Success Page ---
        router.push("/order-success");
    } else {
        toast.error("Order failed. Please try again.");
    }
    
    setIsProcessing(false);
  };
  
  // Helper to check if any card field has an error
  // FIX: Added !! to explicitly cast the result (FieldError object or undefined) to a pure boolean value.
  const hasCardError = !!(errors.cardNumber || errors.cardName || errors.expiryDate || errors.cvv);
  // Determine if the submit button should be disabled for card payment
  const isCardSubmitDisabled = paymentMethod === "card" && hasCardError;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Secure Checkout
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Lock className="w-4 h-4" />
            <span>Your information is safe and secure</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Shipping Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className="rounded-lg"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="mb-2 block">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      className="rounded-lg"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="rounded-lg"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="rounded-lg"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="mb-2 block">Street Address</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      className="rounded-lg"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city" className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4" />
                      City
                    </Label>
                    <Input
                      id="city"
                      {...register("city")}
                      className="rounded-lg"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state" className="mb-2 block">State</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      className="rounded-lg"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="zipCode" className="mb-2 block">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      {...register("zipCode")}
                      className="rounded-lg"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  Payment Method
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-6">
                  {paymentMethodsData.map((method) => (
                    <div 
                      key={method.id} 
                      className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                        paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer flex items-center gap-3 font-medium text-lg">
                          <method.icon className={`w-5 h-5 ${method.iconClasses}`} />
                          {method.label}
                        </Label>
                        {method.id === "card" && (
                          <div className="flex gap-2">
                            <div className="w-10 h-7 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                            <div className="w-10 h-7 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2 ml-8">{method.description}</p>
                    </div>
                  ))}
                </RadioGroup>

                {/* Conditional Card Fields (Visible only for 'card' method) */}
                {paymentMethod === "card" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid gap-4 border-t pt-6"
                    >
                        <div>
                            <Label htmlFor="cardNumber" className="mb-2 block">Card Number</Label>
                            <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            {...register("cardNumber", { required: paymentMethod === 'card' ? "Card number is required" : false })}
                            className="rounded-lg"
                            />
                            {errors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="cardName" className="mb-2 block">Name on Card</Label>
                            <Input
                            id="cardName"
                            {...register("cardName", { required: paymentMethod === 'card' ? "Name on card is required" : false })}
                            className="rounded-lg"
                            />
                            {errors.cardName && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="expiryDate" className="mb-2 block">Expiry Date</Label>
                                <Input
                                id="expiryDate"
                                placeholder="MM/YY"
                                {...register("expiryDate", { required: paymentMethod === 'card' ? "Expiry date is required" : false })}
                                className="rounded-lg"
                                />
                                {errors.expiryDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="cvv" className="mb-2 block">CVV</Label>
                                <Input
                                id="cvv"
                                placeholder="123"
                                {...register("cvv", { required: paymentMethod === 'card' ? "CVV is required" : false })}
                                className="rounded-lg"
                                />
                                {errors.cvv && (
                                <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* Conditional Wallet Phone Input (Visible only for 'wallet' method) */}
                {paymentMethod === "wallet" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t pt-6"
                    >
                        <Label htmlFor="walletPhone" className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4 text-red-600" />
                            Mobile Wallet Phone Number
                        </Label>
                        <Input
                            id="walletPhone"
                            type="tel"
                            placeholder="e.g., 010xxxxxxxx"
                            value={walletPhone}
                            onChange={(e) => setWalletPhone(e.target.value)}
                            className="rounded-lg"
                        />
                        {walletPhone.length > 0 && walletPhone.length < 10 && (
                            <p className="text-red-500 text-sm mt-1">Please enter a valid phone number (at least 10 digits).</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                            We will contact this number for payment confirmation.
                        </p>
                    </motion.div>
                )}

                {/* Information for COD */}
                {paymentMethod === "cod" && (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t pt-4 p-4 bg-green-50 rounded-xl"
                    >
                        <p className="text-sm text-green-700 font-medium">
                            Please prepare the total amount (${total.toFixed(2)}) for the delivery agent.
                        </p>
                    </motion.div>
                )}

              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing || (paymentMethod === 'wallet' && walletPhone.length < 10) || isCardSubmitDisabled}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                >
                  <span className="flex items-center gap-2">
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    <span>{isProcessing ? "Processing..." : `Place Order ($${total.toFixed(2)})`}</span>
                  </span>
                </Button>


                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </main>
  );
}

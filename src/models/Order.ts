import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },
    user: {
      name: String,
      email: String,
    },
    items: [
      {
        name: { 
          type: String, 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true 
        },
        price: { 
          type: Number, 
          required: true 
        },
        image: String,
      },
    ],
    shippingAddress: {
      fullName: { 
        type: String, 
        required: true 
      },
      email: { 
        type: String, 
        required: true 
      },
      phone: { 
        type: String, 
        required: true 
      },
      governorate: { 
        type: String, 
        required: true 
      },
      city: { 
        type: String, 
        required: true 
      },
      street: { 
        type: String, 
        required: true 
      },
      village: String,
      zipCode: { 
        type: String, 
        required: true 
      },
      country: { 
        type: String, 
        default: "Egypt" 
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Completed", "Payment", "Shipped", "Delivered", "Cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;
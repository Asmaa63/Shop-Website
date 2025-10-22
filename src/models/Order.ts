import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    user: {
      name: String,
      email: String,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    shippingAddress: {
  zipCode: String, 
  fullName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  country: String,
},
    totalAmount: Number,
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;

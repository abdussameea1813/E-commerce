import mongoose from 'mongoose';

// Sub-schema for individual items within an order
const orderItemSchema = new mongoose.Schema({
    productId: { // Link to the actual product
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },  // Product name at the time of order
    image: { type: String },                 // Product image URL at the time of order
    price: { type: Number, required: true, min: 0 }, // Price at the time of order
    quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
    user: { // Reference to the User who placed the order
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Assuming all orders are placed by a logged-in user
    },
    items: [orderItemSchema], // Array of products in this order

    // Detailed shipping information
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
    },

    // Payment method for this order (fixed to COD)
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash on Delivery'], // Only COD is allowed for now
        default: 'Cash on Delivery',
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },

    // Current status of the order, crucial for tracking
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending', // All new COD orders start as 'Pending'
    },

    // Timestamp for delivery, used for analytics
    deliveredAt: {
        type: Date, // This field will be populated when the order status changes to 'Delivered'
    },
}, { timestamps: true }); // Mongoose automatically adds `createdAt` and `updatedAt`

const Order = mongoose.model('Order', orderSchema);
export default Order;
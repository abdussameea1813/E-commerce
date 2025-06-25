// frontend/src/hooks/usePlaceOrder.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // For user-friendly notifications

import { useCartStore } from '../stores/useCartStore';     // Get cart data and clear it
import { useUserStore } from '../stores/useUserStore';     // Get user token
import { placeOrderApi } from '../services/orderService.js'; // The Axios API service

const usePlaceOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Useful if you want to display specific error messages on UI
     // For navigation after successful order placement

    const { cart, total, clearCart } = useCartStore(); // Get cart items, total, and clearCart action
    const { token } = useUserStore(); // Get authentication token

    const navigate = useNavigate();

    const placeOrder = async (shippingAddress) => {
        setLoading(true);
        setError(null); // Clear previous errors

        

        // Prepare items for backend: send only what the backend expects for product identification
        // The backend will fetch the latest price, name, image etc. for security and data consistency.
        const orderItems = cart.map(item => ({
            productId: item._id,     // The actual product ID from your product model
            quantity: item.quantity,
            // Optionally, you *could* send name, image, price, but backend should ideally re-verify.
            // name: item.name,
            // image: item.image,
            // price: item.price,
        }));

        const orderData = {
            items: orderItems,
            shippingAddress,
            paymentMethod: 'Cash on Delivery', // Hardcoded as per our backend's current design
            totalAmount: total, // Send the total calculated by your frontend store for initial check
        };

        try {
            // Call the API service function
            const data = await placeOrderApi(orderData, token);

            toast.success('Order placed successfully! Thank you for your purchase.');
            clearCart(); // Clear the cart after a successful order
            navigate(`/order-confirmation/${data.order._id}`); // Navigate to confirmation page using order ID

            return { success: true, order: data.order };

        } catch (err) {
            console.error('Error placing order:', err);
            setError(err.message); // Set error state
            toast.error(err.message || 'An unexpected error occurred. Please try again.'); // Display user-friendly error
            return { success: false, message: err.message };
        } finally {
            setLoading(false); // Always stop loading, regardless of success or failure
        }
    };

    return { placeOrder, loading, error };
};

export default usePlaceOrder;
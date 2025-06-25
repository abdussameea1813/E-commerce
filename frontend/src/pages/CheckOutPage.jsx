// frontend/src/pages/CheckOutPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Zustand Stores
import { useCartStore } from '../stores/useCartStore';

// Custom Hooks
import useCheckoutForm from '../hooks/useCheckoutForm'; // Manages shipping address form state/validation
import usePlaceOrder from '../hooks/usePlaceOrder';     // Handles order submission logic

// Reusable Components
import ShippingAddressForm from '../components/ShippingAddressForm';

// Nested component for Order Summary display on the Checkout Page
const CheckoutOrderSummary = () => {
    const { cart, total } = useCartStore(); // Get cart items and total from Zustand store

    return (
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
                Order Summary
            </h2>
            <div className="space-y-4">
                {cart.map(item => (
                    <div key={item._id} className="flex justify-between items-center text-md">
                        <span className="text-gray-300">{item.name} x {item.quantity}</span>
                        <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div className="flex justify-between items-center text-lg pt-4 border-t border-gray-700">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-semibold text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">Shipping</span>
                    <span className="font-semibold text-white">Free</span> {/* Hardcoded for COD */}
                </div>
                <div className="flex justify-between items-center text-2xl font-bold pt-4 border-t border-gray-700">
                    <span className="text-emerald-400">Order Total</span>
                    <span className="text-emerald-400">${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};


const CheckOutPage = () => {
    const navigate = useNavigate();
    const { cart } = useCartStore(); // Only need 'cart' here to check if it's empty

    // Utilize our custom hooks for managing checkout logic and state
    const { shippingAddress, handleAddressChange, validateAddress } = useCheckoutForm();
    const { placeOrder, loading, error } = usePlaceOrder(); // 'loading' for button state, 'error' for potential UI display

    // Effect to redirect if cart is empty, preventing checkout with no items
    useEffect(() => {
        if (!cart || cart.length === 0) {
            toast.error('Your cart is empty. Please add items before checking out.');
            navigate('/cart');
        }
    }, [cart, navigate]); // Dependencies: re-run if cart or navigate changes

    // Handler for submitting the checkout form
    const handleSubmitOrder = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // First, validate the shipping address fields using the hook's validation function
        const validationError = validateAddress();
        if (validationError) {
            toast.error(validationError); // Display validation error to user
            return; // Stop the submission process
        }

        // If validation passes, call the `placeOrder` function from our custom hook
        // This function handles the API call, loading states, success/error toasts, and navigation
        await placeOrder(shippingAddress);
    };

    return (
        <div className='min-h-screen bg-gray-900 text-white pt-24 pb-12 relative'>
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 opacity-80"></div>
            <div className="absolute inset-0 z-0 radial-gradient"></div> {/* Ensure 'radial-gradient' CSS is defined */}

            <div className='relative z-10 mx-auto max-w-screen-xl px-4 2xl:px-0'>
                <h1 className='text-center text-5xl font-extrabold mb-12 bg-clip-text text-transparent
                                 bg-gradient-to-r from-emerald-400 to-purple-400 drop-shadow-lg animate-fade-in-up'>
                    Secure Checkout
                </h1>

                <div className='flex flex-col lg:flex-row lg:gap-8'>
                    {/* Left Section: Shipping Address Form and Payment Method */}
                    <motion.div
                        className='flex-auto w-full lg:w-2/3 xl:w-3/4 mb-8 lg:mb-0 space-y-6'
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 100 }}
                    >
                        <form onSubmit={handleSubmitOrder}
                              className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50 space-y-6">

                            {/* Render the extracted ShippingAddressForm component */}
                            <ShippingAddressForm
                                shippingAddress={shippingAddress}
                                handleAddressChange={handleAddressChange}
                            />

                            {/* Payment Method Selection - simple for COD */}
                            <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-4">Payment Method</h2>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="cod"
                                    name="paymentMethod"
                                    value="Cash on Delivery"
                                    checked={true} // Always checked as it's the only option
                                    readOnly // Prevent user from unchecking
                                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-600"
                                />
                                <label htmlFor="cod" className="ml-3 text-lg text-white">Cash on Delivery</label>
                            </div>

                            {/* Place Order Button */}
                            <motion.button
                                type="submit"
                                className="mt-8 w-full rounded-full bg-gradient-to-r from-emerald-600 to-purple-600 px-6 py-3 text-center text-lg font-semibold text-white
                                           transition-all duration-300 hover:from-emerald-700 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-xl"
                                whileTap={{ scale: 0.95 }}  
                                disabled={loading || cart.length === 0} // Disable if loading or cart is empty
                            >
                                {loading ? 'Placing Order...' : 'Place Order'} {/* Dynamic button text */}
                            </motion.button>

                            {/* Optional: Display a general error message if needed */}
                            {/* {error && <p className="text-red-500 text-center mt-2">{error}</p>} */}
                        </form>
                    </motion.div>

                    {/* Right Section: Order Summary */}
                    <motion.div
                        className='w-full lg:w-1/3 xl:w-1/4 sticky top-28'
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 100 }}
                    >
                        <CheckoutOrderSummary /> {/* Render the order summary */}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CheckOutPage;
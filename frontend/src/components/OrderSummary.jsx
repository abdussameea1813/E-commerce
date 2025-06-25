import React from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore"; // Assuming this store is correctly configured
import { Link } from "react-router-dom";

const OrderSummary = () => {
  // Get cart items, and the calculation getters from useCartStore
  // Assuming getTotalPrice gives you the sum of (item.price * item.quantity)
  const { cart, total: getTotalPrice } = useCartStore();

  // Calculate subtotal
  const subtotal = getTotalPrice; // This is the sum of all item quantities * prices

  // Simulate a discount for demonstration purposes
  // You would replace this with actual discount logic from your backend/coupon system
  const discountPercentage = 0.1; // 10% discount
  const savings = subtotal * discountPercentage;

  // Shipping cost (as per previous CartPage, assumed Free)
  const shipping = 0; // Free shipping

  // Calculate final total
  const total = subtotal - savings + shipping;

  // Format numbers to 2 decimal places
  const formattedSubTotal = subtotal.toFixed(2);
  const formattedSavings = savings.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedShipping = shipping.toFixed(2);

  // Framer Motion variants for component entrance
  const summaryVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.3, // Delay slightly after cart items appear
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50
                       sticky top-28" // Made sticky and added top padding for fixed navbar
      variants={summaryVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
        Order Summary
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-lg">
          <span className="text-gray-300">Subtotal ({cart.length} items)</span>
          <span className="font-semibold text-white">${formattedSubTotal}</span>
        </div>

        {savings > 0 && ( // Only show savings if there are actual savings
          <div className="flex justify-between items-center text-lg text-red-400">
            <span className="text-gray-300">
              Discount ({discountPercentage * 100}%)
            </span>
            <span className="font-semibold">-${formattedSavings}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-lg">
          <span className="text-gray-300">Shipping</span>
          <span className="font-semibold text-white">
            {shipping === 0 ? "Free" : `$${formattedShipping}`}
          </span>
        </div>

        <div className="flex justify-between items-center text-2xl font-bold pt-4 border-t border-gray-700">
          <span className="text-emerald-400">Order Total</span>
          <span className="text-emerald-400">${formattedTotal}</span>
        </div>
      </div>

      <motion.button
        className="mt-8 w-full rounded-full bg-gradient-to-r from-emerald-600 to-purple-600 px-6 py-3 text-center text-lg font-semibold text-white
               transition-all duration-300 hover:from-emerald-700 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-xl"
        whileTap={{ scale: 0.95 }}
        // Replace the button with a Link component
        // Assuming you have react-router-dom setup
      >
        <Link to="/checkout" className="block w-full h-full">
          Proceed to Checkout
        </Link>
        </motion.button>
      <div className="mt-4 text-center text-gray-300">
        <Link to="/" className="transition-colors duration-200">
          or Continue Shopping
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderSummary;

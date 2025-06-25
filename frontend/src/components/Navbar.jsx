import React from 'react';
import { LogIn, LogOut, LockIcon, ShoppingCartIcon, UserPlus, ShoppingBagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

const Navbar = () => {
  const { user, logout } = useUserStore(); // Example: This will come from your auth context
  const isAdmin = user && user.role === 'admin'; // Example: This will come from your auth context
  const { cart } = useCartStore();

  const totalItems = cart.length; // Get total items from cart store

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }} // Starts off-screen and invisible
      animate={{ y: 0, opacity: 1 }}    // Animates to its position and becomes visible
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }} // Smooth spring animation
      className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-lg shadow-xl z-40
                 border-b border-transparent [  border-image:linear-gradient(to_right,#10B981,#8B5CF6,transparent)1]
                 transition-all duration-300'
    >
      <div className="container px-4 py-3 mx-auto">
        <div className='flex flex-wrap items-center justify-between'>
          {/* Logo */}
          <Link className="text-2xl font-extrabold text-emerald-400 space-x-2 flex items-center group" to="/">
            {/* Added a subtle hover effect to the text */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 group-hover:from-emerald-300 group-hover:to-teal-400 transition-colors duration-300">
              Commerce
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-4 md:gap-6">
            <Link className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out font-medium" to={"/"}>Home</Link>

            {user && (
              <Link className="relative group flex items-center text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out font-medium" to={"/cart"}>
                <ShoppingCartIcon className="inline-block mr-1" size={20} />
                <span className='hidden sm:inline'>Cart</span>
                {/* Refined cart badge */}
                {cart.length > 0 && <span className='absolute -top-2 -right-3 bg-emerald-500 text-white text-xs px-2 py-0.5 w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-gray-900 group-hover:bg-emerald-600 transition-duration-300 ease-in-out'>{totalItems}</span>}
              </Link>
            )}

            {user && (
                <Link to="/my-orders" className="relative group flex items-center text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out font-medium">
                    <ShoppingBagIcon className="inline-block mr-1" size={20} />
                    <span className='hidden sm:inline'>My Orders</span>
                    {/* Optional: Add a badge for new orders */}
                    {/* {newOrdersCount > 0 && (
                        <span className='absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-gray-900 group-hover:bg-red-600 transition-duration-300 ease-in-out'>
                            {newOrdersCount}
                        </span>
                    )} */}
                </Link>
            )}

            {isAdmin && (
              <Link to={"/secret-dashboard"} className="flex items-center text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out font-medium" >
                <LockIcon className="inline-block mr-1" size={20} />
                <span className='hidden sm:inline'>Dashboard</span>
              </Link>
            )}

            {user ? (
              <button onClick={logout} className='bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out text-sm font-semibold shadow-lg hover:shadow-xl'>
                <LogOut size={18} />
                <span className='hidden sm:inline ml-2'>Log Out</span>
              </button>
            ) : (
              <>
                <Link to={"/signup"}
                  className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out text-sm font-semibold shadow-lg hover:shadow-xl'
                >
                  <UserPlus size={18} className='mr-2' />
                  <span className='hidden sm:inline'>Sign Up</span>
                </Link>
                <Link to={"/login"}
                  className='bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out text-sm font-semibold shadow-lg hover:shadow-xl'
                >
                  <LogIn size={18} className='mr-2' />
                  <span className='hidden sm:inline'>Log In</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
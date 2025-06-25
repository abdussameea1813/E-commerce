import React, { use, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader, Lock, Mail, LogIn } from 'lucide-react'; // Changed UserPlus to LogIn
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      login({ email, password }); // Call login from the store
      setLoading(false);
      // Reset form fields after submission
      setEmail('');
      setPassword('');
      // Redirect to home or dashboard after successful login
      navigate('/');
    }, 2000);
  };

  // Framer Motion variants for staggered animation (reused from SignupPage)
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          className='mt-6 text-center text-4xl font-extrabold text-emerald-400 drop-shadow-md'
          variants={itemVariants}
        >
          Login to Your Account
        </motion.h2>

        <motion.div
          className='bg-gray-800 bg-opacity-70 backdrop-blur-sm py-10 mt-8 px-4 shadow-2xl rounded-xl sm:px-10 border border-gray-700/50'
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className='space-y-7'>
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-300 mb-1'>Email Address</label> {/* More explicit label */}
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  type="email"
                  id='email'
                  placeholder='johndoe@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Corrected state update for individual state variables
                  required
                  className='block w-full rounded-lg border-0 py-2.5 shadow-sm pl-10 bg-gray-700/50 text-gray-200 placeholder:text-gray-400
                             focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:border-transparent outline-none
                             sm:text-sm sm:leading-6 transition-all duration-200'
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className='block text-sm font-medium leading-6 text-gray-300 mb-1'>Password</label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  type="password"
                  id='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Corrected state update for individual state variables
                  required
                  className='block w-full rounded-lg border-0 py-2.5 shadow-sm pl-10 bg-gray-700/50 text-gray-200 placeholder:text-gray-400
                             focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:border-transparent outline-none
                             sm:text-sm sm:leading-6 transition-all duration-200'
                />
              </div>
            </motion.div>

            {/* Optional: Forgot Password Link */}
            <motion.div variants={itemVariants} className="text-sm text-right">
                <Link to="/forgot-password" className="font-medium text-gray-400 hover:text-purple-400 transition-colors duration-200">
                    Forgot password?
                </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type='submit'
              className='w-full flex justify-center items-center py-2.5 px-4
                         border border-transparent rounded-full shadow-lg text-base font-semibold text-white
                         bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                         transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105'
              disabled={loading}
              variants={itemVariants}
            >
              {loading ? (
                <>
                  <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <LogIn className='mr-2 h-5 w-5' aria-hidden='true' /> {/* Changed icon to LogIn */}
                  <span>Log In</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Don't have an account? */}
          <motion.p
            className='mt-8 text-center text-sm text-gray-400'
            variants={itemVariants}
          >
            Don't have an account?{' '}
            <Link to='/signup' className='font-semibold leading-6 text-emerald-400 hover:text-purple-400 transition duration-300 ease-in-out flex items-center justify-center mt-2'>
              Sign Up here
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
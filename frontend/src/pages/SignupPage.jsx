import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader, Lock, Mail, User } from 'lucide-react'; // Changed UserPlus to User for input field
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [loading, setLoading] = useState(false); // Set to false initially, will be true when submitting
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const { signup } = useUserStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Sign up Attempt:', formData);
      signup(formData);
      setLoading(false);
      // Reset form data after submission
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });  
      navigate('/login'); // Redirect to login page after successful signup
    }, 2000);
  };

  // Framer Motion variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1, // Stagger animation for children elements
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
          Create Your Account
        </motion.h2>

        <motion.div
          className='bg-gray-800 bg-opacity-70 backdrop-blur-sm py-10 mt-8 px-4 shadow-2xl rounded-xl sm:px-10 border border-gray-700/50'
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className='space-y-7'> {/* Increased space-y for better spacing */}
            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className='block text-sm font-medium leading-6 text-gray-300 mb-1'>Full Name</label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  type="text"
                  id='name'
                  placeholder='Enter your Full Name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='block w-full rounded-lg border-0 py-2.5 shadow-sm pl-10 bg-gray-700/50 text-gray-200 placeholder:text-gray-400
                             focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:border-transparent outline-none
                             sm:text-sm sm:leading-6 transition-all duration-200'
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-300 mb-1'>Email</label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  type="email"
                  id='email'
                  placeholder='johndoe@example.com' 
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='block w-full rounded-lg border-0 py-2.5 shadow-sm pl-10 bg-gray-700/50 text-gray-200 placeholder:text-gray-400
                             focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:border-transparent outline-none
                             sm:text-sm sm:leading-6 transition-all duration-200'
                />
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className='block text-sm font-medium leading-6 text-gray-300 mb-1'>Confirm Password</label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  type="password"
                  id='confirmPassword'
                  placeholder='••••••••'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className='block w-full rounded-lg border-0 py-2.5 shadow-sm pl-10 bg-gray-700/50 text-gray-200 placeholder:text-gray-400
                             focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:border-transparent outline-none
                             sm:text-sm sm:leading-6 transition-all duration-200'
                />
              </div>
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
                  <span>Signing Up...</span>
                </>
              ) : (
                <>
                  <User className='mr-2 h-5 w-5' aria-hidden='true' /> {/* Changed to User for signup button */}
                  <span>Sign Up</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Already have an account? */}
          <motion.p
            className='mt-8 text-center text-sm text-gray-400'
            variants={itemVariants}
          >
            Already have an account?{' '}
            <Link to='/login' className='font-semibold leading-6 text-emerald-400 hover:text-purple-400 transition duration-300 ease-in-out flex items-center justify-center mt-2'>
              Login here
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignupPage;
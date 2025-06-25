import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminPage from './pages/AdminPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'

import Navbar from './components/Navbar'
import BackgroundGradient from './components/BackGroundGradient'
import LoadingSpinner from './components/LoadingSpinner'

import { useUserStore } from './stores/useUserStore'
import { useCartStore } from './stores/useCartStore'
import CheckOutPage from './pages/CheckOutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import MyOrdersPage from './pages/MyOrdersPage'


const App = () => {

  const { checkingAuth, checkAuth, user } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }
  , [user, getCartItems]);

  if (checkingAuth) {
    return( <LoadingSpinner /> );
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white ralative overflow-hidden'>
      <BackgroundGradient />

      <div className="ralative z-50 pt-20">
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to="/" />} />
        <Route path='/secret-dashboard' element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" /> } />
        <Route path='/category/:category' element={<CategoryPage />} />
        <Route path='/cart' element={user ? <CartPage /> : <Navigate to="/login" />} />
        <Route path='/checkout' element={user ? <CheckOutPage /> : <Navigate to='/login' />} />
        <Route path='/order-confirmation/:orderId' element={user ? <OrderConfirmationPage /> : <Navigate to='/login' />} />
        <Route path='/my-orders' element={user ? <MyOrdersPage /> : <Navigate to='/login' />} />
      </Routes>
      </div>
    </div>
  )
}

export default App
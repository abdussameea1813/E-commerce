import { create } from 'zustand';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
    cart: [],
    loading: false,
    error: null,
    coupon: null,
    total: 0,
    subtotal: 0,

    getCartItems: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/cart');
            set({ cart: response.data, loading: false });
            get().calculateTotals();
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || 'Failed to fetch cart items' });
        }
    },

    addToCart: async (product) => {
        set({ loading: true, error: null });
        try {
            await axios.post('/cart', { productId: product._id});
            toast.success(`${product.name} added to cart!`);

            set((prevState) => {
                const existingItem = prevState.cart.find(item => item._id === product._id);
                const newCart = existingItem ? prevState.cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)) : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart, loading: false };
            });

            get().calculateTotals();
        } catch (error) {
            console.error('Error adding to cart:', error);
            set({ loading: false, error: error.response?.data?.message || 'Failed to add item to cart' });
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        set({ subtotal, total });
    },

    removeFromCart: async (productId) => {
        await axios.delete(`/cart`, { data: { productId } });
        set((prevState) => ({
            cart: prevState.cart.filter(item => item._id !== productId)
        }));
        get().calculateTotals();
    },

    updateQuantity: async(productId, quantity) => {
        if (quantity === 0) {
            get().romoveFromCart(productId);
            return;
        }
        await axios.put(`/cart/${productId}`, { quantity });
        set((prevState) => ({
            cart: prevState.cart.map(item => item._id === productId ? { ...item, quantity } : item)
        }));
        get().calculateTotals();
    },

    clearCart: () => {
        set({ cart: [] });
        get().calculateTotals();
    },
}))
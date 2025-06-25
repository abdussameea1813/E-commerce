import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axios from '../lib/axios'; // Ensure your axios instance is correctly configured

export const useProductStore = create((set, get) => ({ // Added 'get' to access current state
    products: [],
    loading: false,
    error: null, // Added error state for fetching products

    // No longer explicitly needed if fetchAllProducts is used for initial load
    // setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true, error: null }); // Clear any previous error
        try {
            const res = await axios.post('/products', productData);
            set((state) => ({
                products: [...state.products, res.data], // Assuming res.data is the newly created product
                loading: false,
            }));
            toast.success('Product created successfully');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to create product';
            toast.error(errorMessage);
            set({ loading: false, error: errorMessage }); // Set error state
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true, error: null }); // Set loading true, clear any previous error
        try {
            const res = await axios.get('/products');
            // Assuming res.data.products is an array of products, adjust if it's just res.data
            set({ products: res.data.products, loading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch products';
            console.error("Error fetching products:", error); // Keep console error for debugging
            toast.error(errorMessage);
            set({ loading: false, error: errorMessage }); // Set error state
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true, error: null }); // Set loading true, clear any previous error
        try {
            const res = await axios.get(`/products/category/${category}`);
            set({ products: res.data.products, loading: false });
        } catch (error) {
            set({ loading: false, error: error.response?.data?.error || 'Failed to fetch products by category' });
            toast.error(error.response?.data?.error || 'Failed to fetch products by category');
        }
    },
    deleteProduct: async (id) => {
        set({ loading: true, error: null }); // Optional: show loading on specific action
        try {
            await axios.delete(`/products/${id}`); // Adjust endpoint if needed, e.g., /api/products/${id}
            set((state) => ({
                products: state.products.filter((product) => product._id !== id),
                loading: false,
            }));
            toast.success('Product deleted successfully');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to delete product';
            toast.error(errorMessage);
            set({ loading: false, error: errorMessage });
        }
    },

    toggleFeaturedProduct: async (id) => {
        set({ loading: true, error: null }); // Optional: show loading for this action
        
        try {
            const res =  await axios.patch(`/products/${id}`);
            set((prevProducts) => ({
                products: prevProducts.products.map((product) => 
                    product._id === id ? { ...product, isFeatured: res.data.isFeatured } : product
                ),
                loading: false,
        }));
        } catch (error) {
            set({ loading: false, error: error.response?.data?.error || 'Failed to toggle featured status' });
            toast.error(error.response?.data?.error || 'Failed to toggle featured status');
        }
    },
}));
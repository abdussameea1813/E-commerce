// frontend/src/hooks/useCheckoutForm.js
import { useState } from 'react';
import { useUserStore } from '../stores/useUserStore'; // To pre-fill user name

const useCheckoutForm = () => {
    const { user } = useUserStore(); // Get user data from Zustand store

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '', // Pre-fill with user's name if available
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
    });

    const handleAddressChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    // Basic frontend validation for shipping address fields
    const validateAddress = () => {
        const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];
        for (const field of requiredFields) {
            if (!shippingAddress[field]) {
                // Return a user-friendly error message
                return `The ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field is required.`;
            }
        }
        return null; // No errors
    };

    return { shippingAddress, handleAddressChange, validateAddress };
};

export default useCheckoutForm;
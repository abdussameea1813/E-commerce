// frontend/src/components/checkout/ShippingAddressForm.js
import React from 'react';

const ShippingAddressForm = ({ shippingAddress, handleAddressChange }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-4">Shipping Information</h2>

            {/* Input Fields for shipping address */}
            {['fullName', 'address', 'city', 'postalCode', 'country', 'phone'].map((field) => (
                <div key={field}>
                    <label htmlFor={field} className="block text-gray-300 text-sm font-bold mb-2 capitalize">
                        {field.replace(/([A-Z])/g, ' $1')}: {/* Formats 'fullName' to 'Full Name' */}
                    </label>
                    <input
                        type={field === 'phone' ? 'tel' : 'text'}
                        id={field}
                        name={field}
                        value={shippingAddress[field]}
                        onChange={handleAddressChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-200 leading-tight
                                   focus:outline-none focus:ring-2 focus:ring-emerald-500
                                   bg-gray-700 border-gray-600 placeholder-gray-400"
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        required
                    />
                </div>
            ))}
        </div>
    );
};

export default ShippingAddressForm;
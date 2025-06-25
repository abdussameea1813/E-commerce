import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const placeOrderApi = async (orderData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send JWT token for authentication
            },
            // With Axios, you might not always need `withCredentials` if cookies are auto-sent for same-origin
            // If CORS issues, ensure your backend CORS is configured correctly.
            withCredentials: true, // Important for sending HTTP-only cookies
        };
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData, config);
        return response.data; // Axios automatically parses JSON response
    } catch (error) {
        // Axios errors are often nested. Access error.response.data for backend-specific messages.
        throw new Error(error.response?.data?.message || error.message || 'Failed to place order');
    }
};

export const getMyOrdersApi = async (accessToken) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            withCredentials: true
        };
        // This endpoint maps to your backend's order.controller.js -> getMyOrders
        const response = await axios.get(`${API_BASE_URL}/orders/myorders`, config);
        return response.data.data; // Assuming your backend returns { success: true, count: X, data: [...] }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch my orders');
    }
};

export const getAnalyticsDataApi = async (accessToken) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        };
        const response = await axios.get(`${API_BASE_URL}/orders/analytics`, config);
        return response.data; // Assuming backend returns the data directly
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch analytics data');
    }
};

export const getDailySalesDataApi = async (accessToken) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        };
        const response = await axios.get(`${API_BASE_URL}/analytics/daily-sales`, config);
        return response.data; // Assuming backend returns the data directly
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch daily sales data');
    }
};

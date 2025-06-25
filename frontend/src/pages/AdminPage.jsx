import React, { useEffect, useState } from 'react'
import { BarChart, PlusCircle, ShoppingBasket } from 'lucide-react'

import CreateProductForm from '../components/CreateProductForm';
import ProductsList from '../components/ProductsList';
import AnalyticsTab from '../components/AnalyticsTab';

import { motion } from 'framer-motion'
import { useProductStore } from '../stores/useProductStore';
import { useUserStore } from '../stores/useUserStore';

const tabs = [
        { id: "create", label: "Create Product", icon: <PlusCircle className="h-4 w-4" /> },
        { id: "products", label: "Products", icon: <ShoppingBasket className="h-4 w-4" /> },
        { id: "analytics", label: "Analytics", icon: <BarChart className="h-4 w-4" />    },
    ];

const AdminPage = () => {
    const { user, accessToken, checkingAuth } = useUserStore();
    const [ activetab, setActiveTab ] = useState(tabs[0].id);
    const { fetchAllProducts } = useProductStore();

    useEffect(() => {
        console.log("AdminPage mounted/re-rendered.");
        console.log("  Current User:", user);
        console.log("  Current AccessToken:", accessToken);
        console.log("  Checking Auth Status:", checkingAuth);
    }, [user, accessToken, checkingAuth]); // Log whenever these crucial states change

    // Fetch all products when the component mounts
    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
        <div className="relative z-10 container mx-auto px-4 py-16">
            <motion.h1 
                className="text-4xl font-bold mb-8 text-emerald-400 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Admin Dashboard
            </motion.h1>

            <div className="flex justify-center mb-8">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        className={`flex items-center m-2 px-4 py-2 rounded-lg transition-colors duration-300 ${activetab === tab.id ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                    </motion.button>
                ))} 
            </div>
            {activetab === "create" && <CreateProductForm />}
            {activetab === "products" && <ProductsList />}
            {activetab === "analytics" && <AnalyticsTab />}  
        </div>
    </div>
  )
}

export default AdminPage
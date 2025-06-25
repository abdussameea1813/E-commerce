import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Loader, Tag, DollarSign, FileText, List } from 'lucide-react'; // Removed 'Text' as it wasn't used
import { useProductStore } from '../stores/useProductStore'; // Assuming this store is correctly defined

const categories = ["jeans", "tshirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
    // Destructure createProduct and loading from your Zustand store
    const { createProduct, loading } = useProductStore();

    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null, // Stores the File object or Data URL depending on backend expectation
    });

    const [selectedImageName, setSelectedImageName] = useState("No image selected");

    // Unified change handler for text, number, and select inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevProduct => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    // Specific handler for image file input
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageName(file.name); // Update displayed file name

            // If your backend expects a base64 string (Data URL):
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct(prevProduct => ({
                    ...prevProduct,
                    image: reader.result, // Store the Data URL
                }));
            };
            reader.readAsDataURL(file);

            // If your backend expects a File object (more common for FormData uploads):
            /*
            setNewProduct(prevProduct => ({
                ...prevProduct,
                image: file, // Store the File object directly
            }));
            */
        } else {
            setNewProduct(prevProduct => ({
                ...prevProduct,
                image: null,
            }));
            setSelectedImageName("No image selected");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Pass the newProduct object to the store's action
            await createProduct(newProduct); // Await the async action

            // Reset form fields after successful creation
            setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                image: null,
            });
            setSelectedImageName("No image selected"); // Reset displayed image name

        } catch (error) {
            console.error("Error creating product:", error);
            // The useProductStore should ideally handle toast.error messages already
        }
    };

    // Framer Motion variants for form elements (kept as is, they are good)
    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2,
                duration: 0.8,
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className='bg-gray-800 bg-opacity-70 backdrop-blur-sm shadow-2xl rounded-2xl p-8 sm:p-10 mb-8 max-w-xl mx-auto border border-gray-700/50'
                variants={formVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2
                    className='text-center text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-400 drop-shadow-lg'
                    variants={itemVariants}
                >
                    Create a New Product
                </motion.h2>

                <form className='space-y-6' onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="name" className='block text-sm font-medium text-gray-300 mb-1'>Product Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                name='name'
                                value={newProduct.name}
                                onChange={handleChange} // Use the unified handleChange
                                placeholder="e.g., Classic Blue Jeans"
                                className='w-full p-3 pl-10 mt-1 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200 placeholder:text-gray-500 transition-colors duration-200'
                                required
                            />
                            <Tag className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="description" className='block text-sm font-medium text-gray-300 mb-1'>Description</label>
                        <div className="relative">
                            <textarea
                                id="description"
                                name='description'
                                value={newProduct.description}
                                onChange={handleChange} // Use the unified handleChange
                                placeholder="A detailed description of your product..."
                                className='w-full p-3 pl-10 mt-1 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200 placeholder:text-gray-500 transition-colors duration-200'
                                rows="4"
                                required
                            ></textarea>
                            <FileText className='absolute left-3 top-3 text-gray-400 h-5 w-5' />
                        </div>
                    </motion.div>

                    {/* Price */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="price" className='block text-sm font-medium text-gray-300 mb-1'>Price</label>
                        <div className="relative">
                            <input
                                type="number"
                                id="price"
                                name='price'
                                min="0"
                                step='0.01'
                                value={newProduct.price}
                                onChange={handleChange} // Use the unified handleChange
                                placeholder="0.00"
                                className='w-full p-3 pl-10 mt-1 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200 placeholder:text-gray-500 transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                required
                            />
                            <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
                        </div>
                    </motion.div>

                    {/* Category */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="category" className='block text-sm font-medium text-gray-300 mb-1'>Category</label>
                        <div className="relative">
                            <select
                                id="category"
                                name='category'
                                value={newProduct.category}
                                onChange={handleChange} // Use the unified handleChange
                                className='w-full p-3 pl-10 mt-1 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200 transition-colors duration-200 appearance-none pr-8'
                                required
                            >
                                <option value="" disabled className='text-gray-500'>Select a category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category} className='bg-gray-700 text-gray-200'>{category}</option>
                                ))}
                            </select>
                            <List className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none' />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </div>
                    </motion.div>

                    {/* Image Upload */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="image" className='block text-sm font-medium text-gray-300 mb-1'>Product Image</label>
                        <div className="mt-1 flex items-center">
                            <input
                                type="file"
                                id='image'
                                name='image'
                                className='sr-only'
                                accept='image/*'
                                onChange={handleImageChange} // Use the specific handleImageChange
                            />
                            <label
                                htmlFor="image"
                                className='flex items-center cursor-pointer
                                         bg-gray-700 border border-gray-600 rounded-full px-5 py-2.5 text-gray-300
                                         hover:bg-gray-600 hover:border-emerald-500 transition-all duration-300
                                         shadow-md hover:shadow-lg text-sm font-medium'
                            >
                                <Upload className='h-5 w-5 mr-3 text-emerald-400' />
                                <span>Choose Image</span>
                            </label>
                            <span className='ml-4 text-sm text-gray-400 truncate max-w-[calc(100%-150px)]'>
                                {selectedImageName}
                            </span>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        className='mt-8 w-full flex justify-center items-center py-3 px-4
                                 border border-transparent rounded-full shadow-lg text-base font-semibold text-white
                                 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                                 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105'
                        disabled={loading}
                        variants={itemVariants}
                    >
                        {loading ? (
                            <>
                                <Loader className='animate-spin h-6 w-6 mr-3' />
                                <span className="text-lg">Creating Product...</span>
                            </>
                        ) : (
                            <>
                                <PlusCircle className='h-6 w-6 mr-3' />
                                <span className="text-lg">Create Product</span>
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}; // <--- Corrected closing curly brace

export default CreateProductForm;
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js"; // Ensure you have cloudinary configured


/**
 * @desc Get all products
 * @route GET /api/products
 * @access Public
 */
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        console.error(`Error in getAllProducts: ${error.message}`); // Use error.message for clarity
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


/**
 * @desc Get all featured products
 * @route GET /api/products/featured
 * @access Public
 * NOTE: Caching functionality removed since Redis is no longer used.
 * This function will now always query the database.
 */
export const getFeaturedProducts = async (req, res) => {
    try {
        // Removed Redis caching logic
        const featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts || featuredProducts.length === 0) { // Check for empty array
            return res.status(404).json({ message: "No featured products found" });
        }

        res.json(featuredProducts);
    } catch (error) {
        console.error(`Error in getFeaturedProducts: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


/**
 * @desc Create a new product
 * @route POST /api/products
 * @access Private/Admin
 */
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        let cloudinaryResponse = null;

        // If an image string (e.g., base64) is provided, upload to Cloudinary
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: cloudinaryResponse ? cloudinaryResponse.url : null, // Store Cloudinary URL
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Error in createProduct:", error.message); // Use error.message
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


/**
 * @desc Delete a product by ID
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // If the product has an image, attempt to delete it from Cloudinary
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; // Extract public ID from URL
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error.message);
                // Log the error but don't prevent product deletion from DB if Cloudinary fails
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(`Error in deleteProduct: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


/**
 * @desc Get a few random recommended products
 * @route GET /api/products/recommended
 * @access Public
 */
export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 } // Get 3 random products
            },
            {
                $project: { // Select specific fields
                    _id: 1,
                    name: 1,
                    image: 1,
                    price: 1,
                    description: 1,
                }
            }
        ]);

        res.json(products);
    } catch (error) {
        console.error(`Error in getRecommendedProducts: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


/**
 * @desc Get products by category
 * @route GET /api/products/category/:categoryName
 * @access Public
 */
export const getProductsByCategory = async (req, res) => {
    // Ensure you destructure 'category' correctly from req.params
    // req.params will be an object like { category: 'electronics' }
    const { category } = req.params;

    try {
        const products = await Product.find({ category }); // Query by category field

            res.json({ products }); // Return products in JSON format
    } catch (error) {
        console.error(`Error in getProductsByCategory: ${error.message}`);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


/**
 * @desc Toggle a product's featured status
 * @route PUT /api/products/:id/toggle-featured
 * @access Private/Admin
 * NOTE: Removed Redis cache update as Redis is no longer used.
 */
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.isFeatured = !product.isFeatured; // Toggle the boolean
            const updatedProduct = await product.save(); // Save changes to DB

            // Removed: await updateFeaturedProductsCache(); // No longer needed
            res.json(updatedProduct);
        } else {
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error("Error in toggleFeaturedProduct:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
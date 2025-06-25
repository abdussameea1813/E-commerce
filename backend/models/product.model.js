import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    image: {
        type: String,
        required: [true, "image is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    price: {
        type: Number,
        min: [0, "price must be greater than 0"],
        required: [true, "price is required"],
    },
    category: {
        type: String,
        required: [true, "category is required"],
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
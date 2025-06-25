import express from "express";
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommended", protectRoute, adminRoute, getRecommendedProducts);
router.post("/", createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
// router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
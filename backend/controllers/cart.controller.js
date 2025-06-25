import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItems = await user.cartItems.find(
      (item) => item.id === productId
    );

    if (existingItems) {
      existingItems.quantity += 1;
    } else {
      user.cartItems.push({
        product: productId, // Now correctly referencing the Product ObjectId
        quantity: 1,
      });
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error(`error in addToCart controller: ${error}`);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (item) => item.id === product._id.toString()
      );
      return {
        ...product.toJSON(),
        quantity: item.quantity, // Default quantity to 1 if not specified
      };
    });
    res.json(cartItems);
  } catch (error) {
    console.error(`error in getCartProducts controller: ${error}`);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id != productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params; // Get product ID from URL parameter
        const { quantity } = req.body;
        const user = req.user; // User is populated by protectRoute middleware

        // Corrected line: Find the cart item by comparing the productId from params
        // with the 'product' field (ObjectId) in the cartItems array.
        const existingItem = user.cartItems.find(
            (item) => item.product.toString() === productId // Convert ObjectId to string for comparison
        );

        if (existingItem) {
            // If quantity is 0, remove the item
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
                await user.save();
                // Optionally re-populate cartItems.product for the response if needed
                const updatedUser = await User.findById(user._id).populate('cartItems.product');
                return res.json(updatedUser.cartItems);
            }

            // Update quantity
            existingItem.quantity = quantity;
            await user.save();
            // Optionally re-populate cartItems.product for the response if needed
            const updatedUser = await User.findById(user._id).populate('cartItems.product');
            return res.json(updatedUser.cartItems);
        } else {
            // This 404 is returned if the product ID from the URL is not found in the user's cart
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error(`Error in updateQuantity controller: ${error}`);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
// controllers/order.controller.js
import Order from '../models/order.model.js';
import Product from '../models/product.model.js'; // Ensure this import is present

/**
 * @desc Place a new Cash on Delivery order
 * @route POST /api/orders
 * @access Private (User must be logged in)
 */
export const placeOrder = async (req, res, next) => {
    try {
        const { items: cartItemsFromFrontend, shippingAddress, paymentMethod, totalAmount } = req.body;
        // Renamed 'items' from req.body to 'cartItemsFromFrontend' to avoid confusion

        // Basic validation for essential order details
        if (!cartItemsFromFrontend || cartItemsFromFrontend.length === 0 || !shippingAddress || !paymentMethod || !totalAmount) {
            return res.status(400).json({ success: false, message: 'Missing required order details.' });
        }

        // --- Process and Validate Items & Handle Stock ---
        const orderItems = []; // This will be the structured array for your Order document
        let calculatedTotal = 0; // To recalculate total server-side for security

        for (const cartItem of cartItemsFromFrontend) {
            const product = await Product.findById(cartItem.productId);

            if (!product) {
                // If a product doesn't exist, something is wrong
                // Consider rolling back any previous stock decrements if you implemented them
                return res.status(404).json({ success: false, message: `Product not found for ID: ${cartItem.productId}` });
            }

            if (product.stock < cartItem.quantity) {
                // Insufficient stock
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
            }

            // Decrement stock (assuming you've added the 'stock' field to your Product model)
            product.stock -= cartItem.quantity;
            await product.save();

            // Build the order item for the Order document, using current product details
            orderItems.push({
                productId: product._id,
                name: product.name,
                image: product.image || 'https://via.placeholder.com/400x300.png?text=No+Image', // Use default if image is missing
                price: product.price,
                quantity: cartItem.quantity,
            });

            calculatedTotal += product.price * cartItem.quantity;
        }

        // --- Optional: Re-verify totalAmount sent from frontend ---
        // It's good practice to calculate the total server-side to prevent tampering.
        if (Math.abs(calculatedTotal - totalAmount) > 0.01) { // Allow for tiny floating point differences
            console.warn(`Frontend total mismatch. Expected ${calculatedTotal}, got ${totalAmount}. Using server-calculated.`);
            // You might return an error here, or just proceed with the server-calculated total
            // For now, we'll proceed using the server's calculated total for order creation.
            // If you return an error, remember to revert stock changes.
        }


        // Create the new order with 'Pending' status
        const newOrder = new Order({
            user: req.user._id, // Assign the ID of the currently logged-in user
            items: orderItems, // Use the carefully constructed orderItems array
            shippingAddress,
            paymentMethod,
            totalAmount: calculatedTotal, // Use server-calculated total for accuracy
            orderStatus: 'Pending', // New COD orders are always 'Pending' initially
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, message: 'Order placed successfully!', orderId: savedOrder._id, order: savedOrder });

    } catch (error) {
        console.error(`Error placing order: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }); // Sort by most recent first
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        console.error(`Error fetching orders: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('user', 'name email').sort({ createdAt: -1 }); // Sort by most recent first
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        console.error(`Error fetching user's orders: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'You do not have permission to view this order' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error(`Error fetching order by ID: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStatus } = req.body;

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (newStatus === 'Delivered' && order.orderStatus !== 'Delivered') {
            // Set the `deliveredAt` timestamp only when transitioning TO 'Delivered'
            order.deliveredAt = new Date(); // Current date/time
            console.log(`\n--- ANALYTICS EVENT: ORDER DELIVERED ---`);
            console.log(`Order ID: ${order._id}`);
            console.log(`Delivery Timestamp: ${order.deliveredAt.toISOString()}`);
            console.log(`Total Revenue: $${order.totalAmount}`);
            console.log(`Customer User ID: ${order.user}`); // Assuming `order.user` is the ObjectId
            console.log(`Items Delivered: ${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`);
            console.log(`------------------------------------------\n`);
            // **INTEGRATION POINT:**
            // At this point, you would typically send this data to your actual analytics system.
            // Examples:
            // - `yourAnalyticsService.track('Order Delivered', { orderId: order._id, total: order.totalAmount, deliveredAt: order.deliveredAt });`
            // - Push to a message queue for async processing: `mqClient.publish('order_delivered', { ...order.toObject() });`
            // - Save to a dedicated analytics collection in your database.
        } else if (order.orderStatus === 'Delivered' && newStatus !== 'Delivered') {
            // If an order was previously 'Delivered' but its status is changed back (e.g., 'Shipped'),
            // it's good practice to clear the `deliveredAt` timestamp.
            order.deliveredAt = undefined;
        }

        order.orderStatus = newStatus; // Update the order status

        const updatedOrder = await order.save(); // Save changes to the database
        res.status(200).json({ success: true, message: 'Order status updated successfully', data: updatedOrder });
    } catch (error) {
        console.error(`Error updating order status: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
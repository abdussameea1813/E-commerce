import User from "../models/user.model.js";
import jwt from "jsonwebtoken"; // <-- Add this import

export const protectRoute = async (req, res, next) => {
    try {
        console.log("--- protectRoute: START ---"); // 1. Start of middleware
        console.log("protectRoute: Checking for accessToken in cookies...");

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            console.log("protectRoute: No accessToken found. Returning 401."); // 2. No token path
            return res.status(401).json({ message: "Unauthorized - No access token found" });
        }

        console.log("protectRoute: AccessToken found. Attempting verification..."); // 3. Token found path

        try {
            // Crucial check: Is the secret available?
            console.log("protectRoute: ACCESS_TOKEN_SECRET loaded:", !!process.env.ACCESS_TOKEN_SECRET); // 4. Check secret
            if (!process.env.ACCESS_TOKEN_SECRET) {
                // This would throw an error caught by the outer catch, resulting in a 500
                throw new Error("Environment variable ACCESS_TOKEN_SECRET is not defined.");
            }

            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            console.log("protectRoute: Token decoded successfully. Decoded payload:", decoded); // 5. Token decoded

            // Check if decoded ID exists and is of an expected type (e.g., string for MongoDB ObjectID)
            if (!decoded || !decoded.id) {
                console.log("protectRoute: Decoded token missing 'id' or invalid. Payload:", decoded); // 6. Invalid decoded
                // This would also likely lead to an error in User.findById or a 401 if explicitly handled
                return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
            }

            console.log("protectRoute: Attempting to find user by ID:", decoded.id); // 7. Before DB lookup
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                console.log("protectRoute: User not found in DB for ID:", decoded.id); // 8. User not found
                return res.status(401).json({ message: "Unauthorized - User not found" });
            }

            req.user = user;
            console.log("protectRoute: User found and attached to req.user. User ID:", req.user._id); // 9. User found & attached

            next(); // 10. Proceed to next middleware/route handler
            console.log("--- protectRoute: END (Success) ---");

        } catch (error) {
            // This inner catch specifically handles JWT errors or user lookup issues within the try block
            console.error(`protectRoute: Inner Catch (JWT/User Lookup Error): Name: ${error.name}, Message: ${error.message}`); // 11. Inner catch error
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Access token expired" });
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Unauthorized - Invalid access token" });
            }
            // For any other unexpected errors in this block (e.g., Mongoose error if DB connection drops mid-query)
            console.error("protectRoute: Unexpected error in inner try block:", error); // 12. Unexpected inner error
            return res.status(500).json({
                message: "Internal server error during authentication process (unexpected error in token verification/user lookup)",
                error: error.message,
            });
        }

    } catch (error) {
        // This outer catch handles errors that occur before or outside the inner try-catch,
        // or truly unhandled synchronous errors.
        console.error(`protectRoute: Outer Catch (Global Middleware Error): Name: ${error.name}, Message: ${error.message}`); // 13. Outer catch error
        console.error("Full error object:", error); // Log full error object for more detail
        return res.status(500).json({
            message: "Internal server error during authentication process (global catch)",
            error: error.message,
        });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        // If user is not authenticated or not an admin
        return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
};
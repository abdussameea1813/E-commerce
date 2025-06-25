import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// NOTE: With Redis removed, refresh tokens are now stored solely in HTTP-only cookies.
// This means immediate revocation is not possible without additional mechanisms (e.g., blacklisting,
// which is beyond the scope of simply removing Redis but important to consider for production).

const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m", // Access token expires in 15 minutes
    });

    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d", // Refresh token expires in 7 days
    });

    return { accessToken, refreshToken };
};

const setAuthCookies = (res, accessToken, refreshToken) => {
    // Access Token Cookie (short-lived)
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // Prevents client-side JavaScript from accessing
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    // Refresh Token Cookie (longer-lived)
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
};

const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
};

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password, // Password hashing should happen in the User model pre-save hook
        });

        if (!user) {
            return res.status(400).json({ message: "User not created" });
        }

        // Generate and set tokens as cookies
        const { accessToken, refreshToken } = generateTokens(user._id);
        setAuthCookies(res, accessToken, refreshToken);

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Assuming 'role' is a field in your User model
                accessToken:accessToken
            },
        });
    } catch (error) {
        console.error(`Error in signup: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            // Generate and set tokens as cookies
            const { accessToken, refreshToken } = generateTokens(user._id);
            setAuthCookies(res, accessToken, refreshToken);

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: accessToken, // Include access token in response for convenience
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(`Error in login: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        // Clear both access and refresh token cookies
        clearAuthCookies(res);
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(`Error in logout: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshTokenFromCookie = req.cookies.refreshToken;

        if (!refreshTokenFromCookie) {
            return res.status(401).json({ message: "No refresh token found" });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET);

        // NOTE: Without Redis, we cannot check if the refresh token was revoked server-side
        // (e.g., if a user logged out from another device). The token is considered valid
        // as long as it's not expired and the secret matches.
        // For enhanced security, consider implementing a token blacklisting mechanism
        // in a database if Redis is not an option.

        // Generate a new access token
        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });

        // Set the new access token cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        return res.json({ message: "Access token refreshed successfully" });
    } catch (error) {
        console.error(`Error in refreshToken: ${error.message}`);
        // If the refresh token is invalid or expired, clear cookies and respond with 401
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            clearAuthCookies(res);
            return res.status(401).json({ message: "Invalid or expired refresh token. Please log in again." });
        }
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getProfile = async (req, res) => {
    try {

        if (!req.user) {
            console.log("getProfile: req.user is NOT populated (unexpected given protectRoute logs). Returning 404.");
            return res.status(404).json({ message: "User profile not found." });
        }
        return res.json(req.user.toObject({ getters: true, virtuals: false })); // Use .toObject()

    } catch (error) {
        console.error(`Error in getProfile (Catch block): ${error.message}`);
        // This is the error message that should print to your backend console
        return res.status(500).json({
            message: "Internal server error in getProfile",
            error: error.message,
            detail: error.stack // Include stack for more context during dev
        });
    }
};
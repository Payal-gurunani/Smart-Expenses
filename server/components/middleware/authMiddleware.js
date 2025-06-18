import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const authenticateUser = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : cookieToken;

    if (!token) {
        throw new ApiError(401, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
        throw new ApiError(401, "Invalid token or user does not exist");
    }

    req.user = user;
    next();
});

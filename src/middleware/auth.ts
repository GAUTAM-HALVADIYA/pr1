import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.util";
import userModel from "../models/user.model";
import roleModel from "../models/role.model";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ success: false, message: "No token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = verifyAccessToken(token);

        const user = await userModel.findById(decoded.id).populate("role");
        if (!user) {
            res.status(401).json({ success: false, message: "User not found" });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export const authorize = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user || !req.user.role) {
                res.status(403).json({ success: false, message: "Access denied" });
                return;
            }

            const userRole = req.user.role.name;
            
            if (!allowedRoles.includes(userRole)) {
                res.status(403).json({ success: false, message: "Forbidden: You do not have the required permissions" });
                return;
            }

            next();
        } catch (error) {
            res.status(500).json({ success: false, message: "Authorization error" });
        }
    };
};

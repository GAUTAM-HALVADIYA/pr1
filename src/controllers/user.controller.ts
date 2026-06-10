import { Request, Response } from "express";
import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userModel.find().populate("role", "name");
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userModel.findById(req.params.id).populate("role", "name");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const targetUserId = req.params.id;
        const targetUser = await userModel.findById(targetUserId).populate("role");

        if (!targetUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const currentUserRole = req.user.role.name;
        const targetUserRole = (targetUser.role as any).name;

        // Admin can only update 'User', not 'Admin' or 'Super Admin'
        if (currentUserRole === "Admin" && (targetUserRole === "Admin" || targetUserRole === "Super Admin")) {
            res.status(403).json({ success: false, message: "Admin cannot modify other Admins or Super Admins" });
            return;
        }

        const { name, role } = req.body;
        
        if (role) {
            const roleExists = await roleModel.findById(role);
            if (!roleExists) {
                res.status(400).json({ success: false, message: "Role does not exist" });
                return;
            }
            targetUser.role = role;
        }
        
        if (name) targetUser.name = name;

        await targetUser.save();
        res.status(200).json({ success: true, message: "User updated successfully", data: targetUser });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const targetUserId = req.params.id;
        const targetUser = await userModel.findById(targetUserId).populate("role");

        if (!targetUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const currentUserRole = req.user.role.name;
        const targetUserRole = (targetUser.role as any).name;

        if (currentUserRole === "Admin" && (targetUserRole === "Admin" || targetUserRole === "Super Admin")) {
            res.status(403).json({ success: false, message: "Admin cannot delete other Admins or Super Admins" });
            return;
        }

        await userModel.findByIdAndDelete(targetUserId);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

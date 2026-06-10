import { Request, Response } from "express";
import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import bcrypt from "bcrypt"

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const roleExists = await roleModel.findById(req.body.role);

        if (!roleExists) {
            res.status(404).json({
                success: false,
                message: "Role does not exist",
            });
            return;
        }

        const existingUser = await userModel.findOne({
            email: req.body.email,
        });
        
        if(!existingUser){
            res.status(409).json({
                success: false,
                message: "Email already exists",
            });
            return;
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashPassword
        
        let newUser = await userModel.create(req.body)
        res.status(201).json({
            success: true,
            data: newUser,
        });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const user = await userModel.find().populate("role");
        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { createUser, getUsers };

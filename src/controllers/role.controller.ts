import { Request, Response } from "express";
import roleModel from "../models/role.model";

export const createRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const roleExists = await roleModel.findOne({ name });
        if (roleExists) {
            res.status(400).json({ success: false, message: "Role already exists" });
            return;
        }

        const role = await roleModel.create({ name });
        res.status(201).json({ success: true, message: "Role created successfully", data: role });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const roles = await roleModel.find();
        res.status(200).json({ success: true, data: roles });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRoleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const role = await roleModel.findById(req.params.id);
        if (!role) {
            res.status(404).json({ success: false, message: "Role not found" });
            return;
        }
        res.status(200).json({ success: true, data: role });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const role = await roleModel.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!role) {
            res.status(404).json({ success: false, message: "Role not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Role updated successfully", data: role });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const role = await roleModel.findByIdAndDelete(req.params.id);
        if (!role) {
            res.status(404).json({ success: false, message: "Role not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Role deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

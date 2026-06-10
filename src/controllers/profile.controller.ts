import { Request, Response } from "express";
import profileModel from "../models/profile.model";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;
        const profile = await profileModel.findOne({ user: userId }).populate("user", "name email");
        
        if (!profile) {
            res.status(404).json({ success: false, message: "Profile not found" });
            return;
        }

        res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;
        const { bio, address, dob, avatar } = req.body;

        let profile = await profileModel.findOne({ user: userId });

        if (!profile) {
            profile = await profileModel.create({
                user: userId,
                bio,
                address,
                dob,
                avatar
            });
        } else {
            if (bio !== undefined) profile.bio = bio;
            if (address !== undefined) profile.address = address;
            if (dob !== undefined) profile.dob = dob;
            if (avatar !== undefined) profile.avatar = avatar;
            await profile.save();
        }

        res.status(200).json({ success: true, message: "Profile updated successfully", data: profile });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

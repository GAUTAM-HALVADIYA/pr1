import { Request, Response } from "express";
import userModel from "../models/user.model";
import roleModel from "../models/role.model";
import otpModel from "../models/otp.model";
import bcrypt from "bcrypt";
import { generateOtp } from "../utils/otp.util";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/token.util";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        const roleExists = await roleModel.findById(role);
        if (!roleExists) {
            res.status(404).json({
                success: false,
                message: "Role does not exist",
            });
            return;
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "Email already exists",
            });
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: hashPassword,
            role,
            isVerified: false,
        });

        await otpModel.deleteMany({
            user: newUser._id,
        });

        const otp = generateOtp();
        await otpModel.create({
            user: newUser._id,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60000), // 10 mins expiry
        });

        console.log(` OTP for ${email} is ${otp}`);

        res.status(201).json({
            success: true,
            message: "User registered. Please check console for OTP to verify.",
            data: { id: newUser._id, email: newUser.email },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const otpRecord = await otpModel.findOne({
            user: user._id,
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
            return;
        }

        otpRecord.isUsed = true;
        await otpRecord.save();

        user.isVerified = true;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Account verified successfully",
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        if (!user.isVerified) {
            res.status(403).json({
                success: false,
                message: "Please verify your account first",
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }

        await otpModel.deleteMany({
            user: user._id,
        });

        const otp = generateOtp();
        await otpModel.create({
            user: user._id,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60000),
        });

        console.log(` Login OTP for ${email} is ${otp}`);

        res.status(200).json({
            success: true,
            message: "Login OTP generated. Please check console to verify.",
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyLoginOtp = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email }).populate("role");

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const otpRecord = await otpModel.findOne({
            user: user._id,
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
            return;
        }

        otpRecord.isUsed = true;
        await otpRecord.save();

        const roleData: any = user.role;
        const roleName = roleData?.name || user.role.toString();

        const accessToken = generateAccessToken(user._id.toString(), roleName);
        const refreshToken = generateRefreshToken(
            user._id.toString(),
            roleName,
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        await otpModel.deleteMany({
            user: user._id,
        });
        const otp = generateOtp();
        await otpModel.create({
            user: user._id,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60000),
        });

        console.log(` Reset Password OTP for ${email} is ${otp}`);

        res.status(200).json({
            success: true,
            message: "OTP sent for password reset. Check console.",
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const otpRecord = await otpModel.findOne({
            user: user._id,
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
            return;
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        otpRecord.isUsed = true;
        await otpRecord.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const refreshToken = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: "Refresh token is required",
            });
            return;
        }

        const decoded: any = verifyRefreshToken(refreshToken);
        const user = await userModel.findById(decoded.id).populate("role");

        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({
                success: false,
                message: "Invalid refresh token",
            });
            return;
        }

        const roleData: any = user.role;
        const accessToken = generateAccessToken(
            user._id.toString(),
            roleData.name,
        );

        res.status(200).json({
            accessToken,
        });
    } catch (error: any) {
        res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token",
        });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?._id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const user = await userModel.findById(userId);
        if (user) {
            user.refreshToken = "";
            await user.save();
        }
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import { Request, Response } from "express";
import userModel from "../models/user.model";

const authLogin = async (req: Request, res: Response) => {
    try {
        const exist = await userModel.findOne({ email: req.body.email });

        if (exist) {
            if (
                exist.email === req.body.email &&
                exist.password === req.body.password
            ) {
                res.status(201).json({
                    success: true,
                    data: "success",
                });
                return;
            } else {
                res.status(404).json({
                    success: false,
                    data: "Password is inValid",
                });
                return;
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};


export default authLogin
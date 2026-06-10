import { Router } from "express";
import { register, login, verifyOtp, verifyLoginOtp, forgotPassword, resetPassword, refreshToken, logout } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/verify-login-otp", verifyLoginOtp);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", authenticate, logout);

export default authRouter;
import { Router } from "express";
import authLogin from "../controllers/auth.controller";



const authRouter = Router();

authRouter.post("/login", authLogin);


export default authRouter
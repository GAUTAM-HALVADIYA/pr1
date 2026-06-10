import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/register", createUser);
userRouter.get("/show", getUsers);

export default userRouter;

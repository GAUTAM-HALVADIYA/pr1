import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth";

const userRouter = Router();

userRouter.use(authenticate);
userRouter.use(authorize(["Super Admin", "Admin"]));

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;

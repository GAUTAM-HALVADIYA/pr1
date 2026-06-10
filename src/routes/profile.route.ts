import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth";

const profileRouter = Router();

profileRouter.use(authenticate);

profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile);

export default profileRouter;

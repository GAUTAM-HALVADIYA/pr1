import { Router } from "express";
import { createProfile, deleteProfile, getProfile, updateProfile } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth";

const profileRouter = Router();

profileRouter.use(authenticate);

profileRouter.post("/", createProfile);
profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile);
profileRouter.delete("/", deleteProfile);

export default profileRouter;

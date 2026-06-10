
import { Router } from "express";
import { createRole } from "../controllers/role.controller";

const roleRouter = Router();

roleRouter.post("/register", createRole);


export default roleRouter
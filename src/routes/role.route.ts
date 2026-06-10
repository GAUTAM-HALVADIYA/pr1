import { Router } from "express";
import { createRole, getRoles, getRoleById, updateRole, deleteRole } from "../controllers/role.controller";
import { authenticate, authorize } from "../middleware/auth";

const roleRouter = Router();

roleRouter.use(authenticate);
roleRouter.use(authorize(["Super Admin"]));

roleRouter.post("/", createRole);
roleRouter.get("/", getRoles);
roleRouter.get("/:id", getRoleById);
roleRouter.put("/:id", updateRole);
roleRouter.delete("/:id", deleteRole);

export default roleRouter;
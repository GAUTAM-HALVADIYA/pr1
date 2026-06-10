import express from "express";
import { Request, Response } from "express";
import "dotenv/config";
import dbConnection from "./config/connection";
import roleRouter from "./routes/role.route";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";

const app = express();
const PORT = 3000;
console.log("INDEX LOADED");

dbConnection();

app.use(express.json());

app.use("/api/roles", roleRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

console.log("ROUTE LOADED");

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

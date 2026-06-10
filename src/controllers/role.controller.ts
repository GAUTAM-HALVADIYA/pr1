import { Request, Response } from "express";
import roleModel from "../models/role.model";

const  createRole = async (req: Request, res: Response) => {
    try {
        const role = await roleModel.create(req.body)
        res.status(201).send({
          success:true,
          message:role
        });
    } catch (error) {
        console.log(error);
    }
}

export {createRole} 


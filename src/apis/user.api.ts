import express, { Request, Response } from "express";
import { validateRequest } from "../validations/validation";
import { registerSchema } from "../validations/users.validation";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), async (req: Request, res: Response) => {
    console.log(req.body);
    res.json({ message: "User registered successfully" });
});

export default router;
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedRequest = schema.safeParse(req.body);
        if (!parsedRequest.success) {
            let parsedErrors: string[] = [];
            Object.entries(parsedRequest.error.format()).forEach(([key, value]) => {
                // const errorObj = value as {_errors?: string[]};
                // if (errorObj._errors)
                //     parsedErrors.push(`${key}: ${errorObj._errors.join(", ")}`);
                parsedErrors.push(`${key}: ${value.join(", ")}`);
            });
            res.status(400).json({error: parsedErrors.join("; ")});
            return;
        }
        req.body = parsedRequest.data;
        next();
    };
};
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedRequest = await schema.safeParseAsync(req.body);
      if (!parsedRequest.success) {
        const parsedErrors: string[] = [];
        Object.entries(parsedRequest.error.format()).forEach(([key, value]) => {
          const errorObj = value as { _errors?: string[] };
          if (errorObj._errors)
            parsedErrors.push(`${key}: ${errorObj._errors.join(', ')}`);
        });
        res.status(400).json({ error: parsedErrors.join('; ') });
        return;
      }
      req.body = parsedRequest.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

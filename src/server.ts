// Ref Web: https://medium.com/@lucchesilorenzo/set-up-a-simple-express-js-server-with-typescript-for-rest-apis-9044fee78017
// Install dependencies: npm install express cors morgan helmet ts-patch typescript-transform-paths helmet zod dotenv aws-sdk
// Install dev dependencies: npm i typescript ts-node ts-node-dev eslint @types/express @types/node @types/morgan @types/cors @eslint/js -D

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet"
import env from "./validations/env.validation";
import morgan from "morgan";
import userAPIRoutes from "./apis/user.api";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(
    cors({
        origin: env.APP_ORIGIN
    })
);
app.use(express.json());
// Handle json parsing failures
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({error: "Invalid JSON format in body of request"});
        return;
    }
    next();
});
app.use(express.urlencoded({extended: true}));

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/users", userAPIRoutes);

// Handle internal server errors and return cleaned up response to users
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(" ❌ Uncaught error: ", err);
    res.status(500).json({
        error: "Something went wrong. Please try again later.",
        details: env.NODE_ENV === "dev" ? err.message : undefined,
    });
});

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));

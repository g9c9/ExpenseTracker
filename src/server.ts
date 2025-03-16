// Ref Web: https://medium.com/@lucchesilorenzo/set-up-a-simple-express-js-server-with-typescript-for-rest-apis-9044fee78017
// Install dependencies: npm install express cors morgan helmet ts-patch typescript-transform-paths helmet zod dotenv
// Install dev dependencies: npm i typescript ts-node ts-node-dev eslint @types/express @types/node @types/morgan @types/cors @eslint/js -D

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet"
import env from "./validations/env.validation";
import morgan from "morgan";

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
app.use(express.urlencoded({extended: true}));

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));

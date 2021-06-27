import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./routes";

import "./database";
import { CustomError } from "./class/CustomError";

const app = express();

app.use(cors());

app.use(express.json());

app.use(router);

app.use((err: CustomError, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return response.status(err.status).json({
            error: err.message
        })
    }

    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
});

app.listen(3000, () => console.log("Server is running"));
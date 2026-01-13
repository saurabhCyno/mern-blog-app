import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.resolve(import.meta.dirname, "../.env")
});

// IMPORTS
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRouter from './routes/auth.route.js'

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// CONNECTING DB
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error(`Failed to connect to server due to DB error : ${error.message}`);
    })

app.get('/api/health', (req, res) => {
    res.json({
        status: "OK",
        message: "Health check successful"
    })
});

// ROUTES
app.use('/api/auth', userRouter)

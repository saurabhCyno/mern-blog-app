import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.resolve(import.meta.dirname, "../.env")
});

import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: "OK",
        message: "Health check successful"
    })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
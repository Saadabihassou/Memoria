import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import PostRouter from './routes/PostRoute.js';
import UserRouter from './routes/UserRoutes.js';

dotenv.config()

const app = express();

// middelwares
app.use(express.json());
app.use(cors());
app.use("/api/posts", PostRouter);
app.use("/api/users", UserRouter);
app.use(morgan("dev"));

// test
app.get('/', (req, res) => {
    res.json({message: "Api working!"})
})

const PORT = process.env.PORT || 5000

// run
app.listen(PORT, async () => {
    await connectDB()
    console.log("Server running on PORT", PORT)
})
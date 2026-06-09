import express from "express";
import { signin, signup, EditProfile, DeleteProfile } from "../controllers/AuthController.js";
import { auth } from "../middlewares/auth.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/signin", signin);
UserRouter.put("/edit/:id", auth, EditProfile);
UserRouter.delete("/delete/:id", auth, DeleteProfile);

export default UserRouter;
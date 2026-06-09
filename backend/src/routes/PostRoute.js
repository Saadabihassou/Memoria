import { Router } from "express";
import {
  getPosts,
  CreatePost,
  EditPost,
  DeletePost,
  LikePost,
  CreateComment,
  DeleteComment,
} from "../controllers/PostController.js";
import { auth } from "../middlewares/auth.js";

const PostRouter = Router();

PostRouter.get("/", getPosts);
PostRouter.post("/create", auth, CreatePost);
PostRouter.put("/edit/:id", auth, EditPost);
PostRouter.delete("/delete/:id", auth, DeletePost);
PostRouter.post("/like/:id", auth, LikePost);
PostRouter.post("/comment/:id", auth, CreateComment);
PostRouter.delete("/:postId/comments/:commentId", auth, DeleteComment);

export default PostRouter;

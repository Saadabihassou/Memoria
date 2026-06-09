import { Post } from "../models/Post.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      creator: req.userId, // Use the authenticated user's ID from the request object (set by the auth middleware) to filter posts created by that user.
    }).sort({ createdAt: -1 });
    res.json({ message: "Data fetched!", posts });
  } catch (error) {
    res.json({ message: "Failed to fetch posts!" });
  }
};

export const CreatePost = async (req, res) => {
  try {
    const body = req.body;
    const post = {
      title: body.title,
      message: body.message,
      creator: req.userId, // Use the authenticated user's ID from the request object (set by the auth middleware) as the creator of the post.
      selectedFile: body.selectedFile,
      tags: body.tags,
    };

    const newPost = new Post(post);
    await newPost.save();
    res.json({ message: "Post created!", PostData: newPost });
  } catch (error) {
    res.json({ message: "Failed to create post!" });
  }
};

export const EditPost = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const post = {
      title: body.title,
      message: body.message,
      creator: req.userId, // Use the authenticated user's ID from the request object (set by the auth middleware) as the creator of the post.
      selectedFile: body.selectedFile,
      tags: body.tags,
    };

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.json({ message: "Post not found!" });
    }
    if (existingPost.creator.toString() !== req.userId) {
      return res.json({ message: "You are not the creator of this post!" });
    }

    await Post.findByIdAndUpdate(id, post);
    res.json({ message: "Post updated!", EditedPostData: post });
  } catch (error) {
    res.json({ message: "Failed to edit post!" });
  }
};

export const DeletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.json({ message: "Post not found!" });
    }
    if (existingPost.creator.toString() !== req.userId) {
      return res.json({ message: "You are not the creator of this post!" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted!" });
  } catch (error) {
    res.json({ message: "Failed to delete post!" });
  }
};

export const LikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.json({ message: "Post not found!" });
    }

    const index = existingPost.likes.findIndex(
      (id) => id.toString() === req.userId,
    );
    if (index === -1) {
      // This condition checks if the authenticated user's ID (req.userId) is not already present in the likes array of the existing post. If the index is -1, it means that the user has not liked the post yet, and their ID will be added to the likes array. If the index is not -1, it means that the user has already liked the post, and their ID will be removed from the likes array.
      existingPost.likes.push(req.userId); // If the user has not liked the post, add their ID to the likes array.
    } else {
      existingPost.likes = existingPost.likes.filter(
        (id) => id.toString() !== req.userId,
      ); // If the user has already liked the post, remove their ID from the likes array.
    }

    const updatedPost = await Post.findByIdAndUpdate(id, existingPost, {
      new: true,
    }); // Update the post in the database with the modified likes array and return the updated post.
    res.json({ message: "Post liked/unliked!", UpdatedPostData: updatedPost });
  } catch (error) {
    res.json({ message: "Failed to like/unlike post!" });
  }
};

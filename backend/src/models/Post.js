import mongoose, { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: String,
    message: String,
    creator: String,
    selectedFile: String,
    tags: [String],
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        username: {
          type: String,
          required: true,
        },

        text: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = model("Post", PostSchema);

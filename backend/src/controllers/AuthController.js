import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { Post } from "../models/Post.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12), // Hash the password using bcrypt before storing it in the database.
      avatar: `https://ui-avatars.com/api/?name=${name}&background=00FF44`, // This line is used to generate a URL for the user's avatar image using the ui-avatars service. The URL includes the user's name and a random background color, which allows for a unique avatar image to be created for each user based on their name.
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password); // bcrypt.compare is used to compare both the plain text password provided by the user and the hashed password stored in the database.

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token: In a simple explanation, a JWT token is a secure way to represent user information. It contains a payload (in this case, the user ID) that is signed with a secret key. This token can be used for authentication and authorization in subsequent requests, allowing the server to verify the user's identity without needing to query the database for every request. The token also has an expiration time, enhancing security by limiting how long it can be used.
    const token = jwt.sign(
      {
        userId: user._id, // Include user ID in the token payload
      },
      process.env.JWT_SECRET, // Use a secret key from environment variables for signing the token
      {
        expiresIn: "7d", // Set token expiration time (e.g., 7 days)
      },
    );

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const EditProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const user = {
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 12), // Hash the new password using bcrypt before updating it in the database.
      avatar: `https://ui-avatars.com/api/?name=${body.name}&background=00FF44`,
    };

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (existingUser._id.toString() !== req.userId) {
      return res.status(401).json({
        message: "You are not the user!",
      });
    }

    await User.findByIdAndUpdate(id, user);
    res.status(200).json({
      message: "User updated!",
      EditedUserData: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const DeleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("req.userId:", req.userId);
    console.log("existingUser._id:", existingUser._id.toString());

    if (existingUser._id.toString() !== req.userId) {
      return res.status(401).json({
        message: "You are not the user!",
      });
    }

    // deleting user and all posts created by that user
    await User.findByIdAndDelete(id);
    await Post.deleteMany({ creator: id }); // This line is used to delete all posts from the database that were created by the user being deleted. It uses the Post model to find and remove all posts where the creator field matches the user's ID.
    res.status(200).json({
      message:
        "User deleted! All posts created by the user have also been deleted.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

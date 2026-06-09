import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    avatar: String,
  },
  { timestamps: true },
);

const User = model("User", UserSchema);

export default User;
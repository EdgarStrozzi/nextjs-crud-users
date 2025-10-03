import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,          
      trim: true,
      lowercase: true,       
    },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  { timestamps: true }
);

// Helpful for dev hot-reload uniqueness
UserSchema.index({ email: 1 }, { unique: true });

export default models.User || model("User", UserSchema);
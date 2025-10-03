import mongoose, { Schema, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" }
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: string };

export default mongoose.models.User || mongoose.model("User", UserSchema);

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please set MONGODB_URI in your .env file");
}

interface GlobalWithMongoose {
  mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

// @ts-ignore
let cached: GlobalWithMongoose["mongoose"] = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || "nextjs_crud" })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

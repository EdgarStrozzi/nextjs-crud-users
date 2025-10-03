import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import User from "../../../models/User";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["User", "Admin"]),
});

export async function GET() {
  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: users });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = UserSchema.parse(body); 
    await dbConnect();
    const created = await User.create(parsed);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    // Zod error
    if (err?.issues) {
      return NextResponse.json(
        { success: false, error: err.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    // Duplicate email (Mongo)
    if (err?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET() {
  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    const created = await User.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

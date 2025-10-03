import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { z } from "zod";

const UpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["User", "Admin"]),
});

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const parsed = UpdateSchema.parse(body); 
    await dbConnect();
    const updated = await User.findByIdAndUpdate(params.id, parsed, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json(
        { success: false, error: err.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
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

export async function DELETE(_req: Request, { params }: Params) {
  await dbConnect();
  const deleted = await User.findByIdAndDelete(params.id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
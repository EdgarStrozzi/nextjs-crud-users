import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import User from "../../../../models/User";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  try {
    const data = await req.json();
    await dbConnect();
    const updated = await User.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  await dbConnect();
  const deleted = await User.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

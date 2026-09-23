import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getAllUsers } from "@/lib/storage/users";

export async function GET() {
  try {
    const current = await requireUser();
    const users = (await getAllUsers()).filter((user) => user.id !== current.id).map(({ id, name }) => ({ id, name }));
    return NextResponse.json({ users });
  } catch { return NextResponse.json({ error: "Unauthorized." }, { status: 401 }); }
}

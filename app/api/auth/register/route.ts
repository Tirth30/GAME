import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/storage/users";
import { validateRegistration } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const result = validateRegistration(await request.json());
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    if (await getUserByEmail(result.email)) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    const user = await createUser({ name: result.name, email: result.email, passwordHash: await hashPassword(result.password) });
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Unable to create account." }, { status: 500 }); }
}

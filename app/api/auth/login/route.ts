import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/storage/users";
import { validEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const user = validEmail(email) ? await getUserByEmail(email) : undefined;
    if (!user || !(await verifyPassword(password, user.passwordHash))) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Unable to sign in." }, { status: 500 }); }
}

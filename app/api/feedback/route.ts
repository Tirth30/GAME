import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createFeedback, hasSubmitted, markSubmitted } from "@/lib/storage/feedback";
import { getUserById } from "@/lib/storage/users";
import { validateFeedback } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const result = validateFeedback(await request.json());
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    if (result.targetUserId === user.id) return NextResponse.json({ error: "You cannot give feedback to yourself." }, { status: 400 });
    if (!(await getUserById(result.targetUserId))) return NextResponse.json({ error: "That person could not be found." }, { status: 404 });
    // This private index prevents duplicates without entering the anonymous feedback record.
    if (await hasSubmitted(user.id, result.targetUserId)) return NextResponse.json({ error: "You have already submitted feedback for this person." }, { status: 409 });
    await createFeedback({ targetUserId: result.targetUserId, pro: result.pro, con: result.con, comment: result.comment });
    await markSubmitted(user.id, result.targetUserId);
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized." : "Unable to submit feedback." }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 }); }
}

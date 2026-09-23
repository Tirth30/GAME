import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getFeedbackForUser } from "@/lib/storage/feedback";

export async function GET() {
  try {
    const user = await requireUser();
    const feedback = await getFeedbackForUser(user.id);
    return NextResponse.json({ feedback: feedback.map(({ pro, con, comment }) => ({ pro, con, comment })) });
  } catch { return NextResponse.json({ error: "Unauthorized." }, { status: 401 }); }
}

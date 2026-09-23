import { randomUUID } from "node:crypto";
import type { Feedback, SubmissionRecord } from "@/lib/types";
import { listObjects, objectExists, objectKey, writeObject } from "./s3";

export async function createFeedback(input: Omit<Feedback, "id" | "createdAt">) {
  const record: Feedback = { id: randomUUID(), ...input, createdAt: new Date().toISOString() };
  await writeObject(objectKey("feedback", record.id), record);
  return record;
}

export async function getFeedbackForUser(targetUserId: string) {
  const feedback = await listObjects<Feedback>("feedback");
  return feedback.filter((record) => record.targetUserId === targetUserId);
}

// Submission indexes are authorization metadata and never returned by feedback APIs.
export async function hasSubmitted(submitterUserId: string, targetUserId: string) {
  return objectExists(objectKey("submissions", `${submitterUserId}/${targetUserId}`));
}

export async function markSubmitted(submitterUserId: string, targetUserId: string) {
  const record: SubmissionRecord = { submitted: true, createdAt: new Date().toISOString() };
  await writeObject(objectKey("submissions", `${submitterUserId}/${targetUserId}`), record);
}

import type { Session } from "@/lib/types";
import { deleteObject, objectKey, readObject, writeObject } from "./s3";

export async function createStoredSession(session: Session) {
  await writeObject(objectKey("sessions", session.id), session);
}

export async function getStoredSession(id: string) {
  const session = await readObject<Session>(objectKey("sessions", id));
  if (!session || new Date(session.expiresAt) <= new Date()) return undefined;
  return session;
}

export async function deleteStoredSession(id: string) {
  await deleteObject(objectKey("sessions", id));
}

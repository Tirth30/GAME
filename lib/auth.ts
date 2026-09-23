import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/storage/users";
import { createStoredSession, deleteStoredSession, getStoredSession } from "@/lib/storage/sessions";
import type { User } from "@/lib/types";

const scrypt = promisify(scryptCallback);
const COOKIE = "anonymous_feedback_session";
const sessionSecret = process.env.SESSION_SECRET;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(key, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

function sign(id: string) {
  const secret = sessionSecret || (process.env.NODE_ENV === "production" ? undefined : "local-development-session-secret");
  if (!secret) throw new Error("SESSION_SECRET is required in production.");
  return createHmac("sha256", secret).update(id).digest("hex");
}
function cookieValue(id: string) { return `${id}.${sign(id)}`; }

export async function createSession(userId: string) {
  const id = randomBytes(32).toString("hex");
  await createStoredSession({ id, userId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString() });
  (await cookies()).set(COOKIE, cookieValue(id), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
}

async function getSessionId() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return undefined;
  const [id, signature] = value.split(".");
  const expected = id ? sign(id) : "";
  if (!id || !signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return undefined;
  return id;
}

export async function getCurrentUser(): Promise<Omit<User, "passwordHash"> | undefined> {
  const id = await getSessionId();
  const session = id ? await getStoredSession(id) : undefined;
  const user = session ? await getUserById(session.userId) : undefined;
  if (!user) return undefined;
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function destroySession() {
  const id = await getSessionId();
  if (id) await deleteStoredSession(id);
  (await cookies()).delete(COOKIE);
}

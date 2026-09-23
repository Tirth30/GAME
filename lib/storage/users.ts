import { createHash, randomUUID } from "node:crypto";
import type { User } from "@/lib/types";
import { listObjects, objectKey, readObject, writeObject } from "./s3";

function emailKey(email: string) {
  const hash = createHash("sha256").update(email).digest("hex");
  return objectKey("email-index", hash);
}

export async function createUser(input: { name: string; email: string; passwordHash: string }): Promise<User> {
  const user: User = { id: randomUUID(), ...input, createdAt: new Date().toISOString() };
  await writeObject(objectKey("users", user.id), user);
  await writeObject(emailKey(user.email), { userId: user.id });
  return user;
}

export async function getUserByEmail(email: string) {
  const index = await readObject<{ userId: string }>(emailKey(email));
  return index ? getUserById(index.userId) : undefined;
}

export async function getUserById(id: string) {
  return readObject<User>(objectKey("users", id));
}

export async function getAllUsers() {
  return listObjects<User>("users");
}

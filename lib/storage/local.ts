import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), ".data");

export async function readCollection<T>(collection: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(path.join(root, `${collection}.json`), "utf8")) as T[];
  } catch {
    return [];
  }
}

export async function writeCollection<T>(collection: string, records: T[]) {
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, `${collection}.json`), JSON.stringify(records, null, 2), "utf8");
}

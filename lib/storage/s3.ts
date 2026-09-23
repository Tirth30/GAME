import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const bucket = process.env.AWS_S3_BUCKET;
const client = new S3Client({ region: process.env.AWS_REGION });

function getBucket() {
  if (!bucket) throw new Error("AWS_S3_BUCKET is required.");
  return bucket;
}

export function objectKey(prefix: string, id: string) {
  return `${prefix}/${id}.json`;
}

export async function readObject<T>(key: string): Promise<T | undefined> {
  try {
    const response = await client.send(new GetObjectCommand({ Bucket: getBucket(), Key: key }));
    if (!response.Body) return undefined;
    return JSON.parse(await response.Body.transformToString()) as T;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if ((error as { name?: string }).name === "NoSuchKey" || status === 404) return undefined;
    throw error;
  }
}

export async function writeObject<T>(key: string, value: T) {
  await client.send(new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    Body: JSON.stringify(value),
    ContentType: "application/json",
    ServerSideEncryption: "AES256",
  }));
}

export async function deleteObject(key: string) {
  await client.send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }));
}

export async function objectExists(key: string) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: getBucket(), Key: key }));
    return true;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 404 || (error as { name?: string }).name === "NotFound") return false;
    throw error;
  }
}

export async function listObjects<T>(prefix: string): Promise<T[]> {
  const records: T[] = [];
  let continuationToken: string | undefined;
  do {
    const response = await client.send(new ListObjectsV2Command({
      Bucket: getBucket(),
      Prefix: `${prefix}/`,
      ContinuationToken: continuationToken,
    }));
    for (const item of response.Contents ?? []) {
      if (!item.Key) continue;
      const record = await readObject<T>(item.Key);
      if (record) records.push(record);
    }
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);
  return records;
}

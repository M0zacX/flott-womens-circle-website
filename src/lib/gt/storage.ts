export function enterpriseFileKey(submissionId: string, fileName: string): string {
  const sanitized = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-120) || "file.pdf";
  return `enterprise/${submissionId}/${sanitized}`;
}

export async function putFile(bucket: R2Bucket, key: string, file: File): Promise<void> {
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/pdf" },
  });
}

export async function getFile(bucket: R2Bucket, key: string): Promise<R2Object | null> {
  return bucket.get(key);
}

export async function deleteFile(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key);
}

/// <reference types="astro/client" />

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface R2HTTPMetadata {
  contentType?: string;
}

interface R2Object {
  body: ReadableStream;
  httpMetadata?: R2HTTPMetadata;
  size: number;
}

interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream | string, options?: R2PutOptions): Promise<unknown>;
  get(key: string): Promise<R2Object | null>;
}

type GTRuntimeEnv = {
  GT_DB: D1Database;
  GT_UPLOADS: R2Bucket;
  EMAIL_ENABLED: string;
  PAYMENTS_ENABLED: string;
  EMAIL_FROM: string;
  ADMIN_NOTIFY_TO: string;
  ADMIN_PASSWORD: string;
  RESEND_API_KEY: string;
  SESSION_SECRET: string;
};

declare namespace App {
  interface Locals {
    runtime: {
      env: GTRuntimeEnv;
    };
  }
}

import type { Field, FormConfig } from "../../data/grand-table-forms";
import { COUNTRIES } from "../../data/grand-table-forms";

export type ValidationErrors = Record<string, string>;

export type ValidationResult = {
  errors: ValidationErrors;
  data: Record<string, string>;
  file: File | null;
  /** Optional badge headshot (image field). Independent of the PDF `file` and of GT_UPLOADS — it is
   * forwarded to FlottHive, not stored in this site's R2. */
  photo: File | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^[0-9+()\-.\s]{6,20}$/;
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+/i;
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

export async function validateSubmission(form: FormConfig, formData: FormData, opts: { uploadsEnabled?: boolean } = {}): Promise<ValidationResult> {
  const errors: ValidationErrors = {};
  const data: Record<string, string> = {};
  let file: File | null = null;
  let photo: File | null = null;

  for (const field of form.fields) {
    const raw = formData.get(field.name);

    if (field.type === "image") {
      const candidate = raw instanceof File ? raw : null;
      if (!candidate || candidate.size === 0) {
        if (field.required) errors[field.name] = `${field.label} is required`;
        continue;
      }
      const photoError = await validatePhotoFile(candidate);
      if (photoError) {
        errors[field.name] = photoError;
        continue;
      }
      photo = candidate;
      continue;
    }

    if (field.type === "file") {
      if (opts.uploadsEnabled === false) continue;
      const candidate = raw instanceof File ? raw : null;
      if (!candidate || candidate.size === 0) {
        if (field.required) errors[field.name] = `${field.label} is required`;
        continue;
      }
      const fileError = await validateFile(candidate, field);
      if (fileError) {
        errors[field.name] = fileError;
        continue;
      }
      file = candidate;
      continue;
    }

    if (field.type === "checkbox") {
      const checkboxValue = typeof raw === "string" ? raw.toLowerCase() : "";
      const checked = checkboxValue === "yes" || checkboxValue === "on";
      if (field.required && !checked) {
        errors[field.name] = `${field.label} is required`;
        continue;
      }
      if (checked) data[field.name] = "Yes";
      continue;
    }

    const value = typeof raw === "string" ? raw.trim() : "";

    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`;
      continue;
    }
    if (!value) continue;

    const fieldError = validateFieldValue(field, value);
    if (fieldError) {
      errors[field.name] = fieldError;
      continue;
    }

    data[field.name] = value;
  }

  return { errors, data, file, photo };
}

// Supported badge-photo types, by magic bytes (content-type headers are client-controlled). Mirrors
// FlottHive's src/lib/photo.ts so what we accept here is exactly what it will accept on ingest.
const HEIF_BRANDS = new Set(["heic", "heix", "heim", "heis", "hevc", "hevx", "mif1", "msf1", "heif"]);

function looksLikeImage(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true; // JPEG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true; // PNG
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true; // WEBP
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return HEIF_BRANDS.has(String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])); // HEIC/HEIF
  }
  return false;
}

async function validatePhotoFile(file: File): Promise<string | null> {
  if (file.size > MAX_PHOTO_BYTES) return "Photo must be 8 MB or smaller";
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!looksLikeImage(head)) return "Use a JPG, PNG, WEBP or HEIC image";
  return null;
}

function validateFieldValue(field: Field, value: string): string | null {
  switch (field.type) {
    case "email":
      return EMAIL_RE.test(value) ? null : "Enter a valid email address";
    case "tel":
      return TEL_RE.test(value) ? null : "Enter a valid phone number";
    case "url":
      return URL_RE.test(value) ? null : "Enter a valid website address";
    case "number":
      return Number.isFinite(Number(value)) ? null : "Enter a valid number";
    case "select":
      return field.options && !field.options.includes(value) ? "Choose a valid option" : null;
    case "country":
      return COUNTRIES.includes(value) ? null : "Choose a valid country";
    default:
      return null;
  }
}

async function validateFile(file: File, field: Field): Promise<string | null> {
  const looksLikePdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (field.accept === "application/pdf" && !looksLikePdf) {
    return "File must be a PDF";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "File must be 10 MB or smaller";
  }
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const isPdf = PDF_MAGIC.every((byte, i) => head[i] === byte);
  if (!isPdf) {
    return "File must be a valid PDF";
  }
  return null;
}

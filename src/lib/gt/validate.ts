import type { Field, FormConfig } from "../../data/grand-table-forms";
import { COUNTRIES } from "../../data/grand-table-forms";

export type ValidationErrors = Record<string, string>;

export type ValidationResult = {
  errors: ValidationErrors;
  data: Record<string, string>;
  file: File | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^[0-9+()\-.\s]{6,20}$/;
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+/i;
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function validateSubmission(form: FormConfig, formData: FormData): Promise<ValidationResult> {
  const errors: ValidationErrors = {};
  const data: Record<string, string> = {};
  let file: File | null = null;

  for (const field of form.fields) {
    const raw = formData.get(field.name);

    if (field.type === "file") {
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

  return { errors, data, file };
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

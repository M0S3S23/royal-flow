export const INQUIRY_TYPES = [
  "General enquiry",
  "Investment / partnership",
  "Supporting Riverbox",
  "NGO / development organisation",
  "Technical or fabrication partner",
  "Community / deployment site",
  "Media / PR",
  "Research / university",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  inquiryType: InquiryType;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function validateContact(body: Record<string, unknown>):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: Record<string, string> } {
  const data = {
    name: str(body.name, 120),
    email: str(body.email, 200).toLowerCase(),
    phone: str(body.phone, 40) || undefined,
    organization: str(body.organization, 160) || undefined,
    inquiryType: str(body.inquiryType, 60) as InquiryType,
    message: str(body.message, 5000),
  };
  const errors: Record<string, string> = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
  if (!INQUIRY_TYPES.includes(data.inquiryType)) errors.inquiryType = "Please choose a topic.";
  if (data.message.length < 10) errors.message = "Please write at least 10 characters.";
  if (data.phone && !/^[+\d\s()-]{6,40}$/.test(data.phone)) errors.phone = "Please enter a valid phone number.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

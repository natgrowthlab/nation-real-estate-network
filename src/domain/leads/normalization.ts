export function normalizeEmail(value?: string): string | null {
  const email = value?.trim().toLowerCase();
  return email || null;
}

export function normalizePhone(value?: string): string | null {
  if (!value?.trim()) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("3")) return `+57${digits}`;
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return null;
}

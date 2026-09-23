export const LIMITS = { name: 60, email: 254, password: 128, feedback: 1200, comment: 1200 };

export function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max) : "";
}

export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= LIMITS.email;
}

export function validateRegistration(input: Record<string, unknown>) {
  const name = cleanText(input.name, LIMITS.name);
  const email = cleanText(input.email, LIMITS.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";
  const confirmPassword = typeof input.confirmPassword === "string" ? input.confirmPassword : "";
  if (name.length < 2) return { error: "Please enter a name with at least 2 characters." };
  if (!validEmail(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8 || password.length > LIMITS.password) return { error: "Password must be 8 to 128 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };
  return { name, email, password };
}

export function validateFeedback(input: Record<string, unknown>) {
  const targetUserId = cleanText(input.targetUserId, 100);
  const pro = cleanText(input.pro, LIMITS.feedback);
  const con = cleanText(input.con, LIMITS.feedback);
  const comment = cleanText(input.comment, LIMITS.comment);
  if (!targetUserId) return { error: "Choose someone to give feedback to." };
  if (!pro) return { error: "Please share one thing you appreciate." };
  if (!con) return { error: "Please share one constructive improvement." };
  return { targetUserId, pro, con, comment: comment || undefined };
}

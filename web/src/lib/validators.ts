// Lightweight validators for registration credentials
export function validateEmail(email: string): boolean {
  // Basic email RFC pattern
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateUsername(username: string): boolean {
  // 3-24 chars, letters, numbers, underscore
  const re = /^[a-zA-Z0-9_]{3,24}$/;
  return re.test(username);
}

export function validatePhone(phone: string): boolean {
  // E.164 format: + followed by 8-15 digits, no spaces
  const re = /^\+[1-9]\d{7,14}$/;
  return re.test(phone);
}
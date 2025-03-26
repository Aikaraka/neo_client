export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (!domain) return email;

  if (localPart.length > 5) {
    return `${localPart.slice(0, 3)}${"*".repeat(
      localPart.length - 3
    )}@${domain}`;
  }

  const visibleCount = Math.ceil(localPart.length / 2);
  return `${localPart.slice(0, visibleCount)}${"*".repeat(
    localPart.length - visibleCount
  )}@${domain}`;
}

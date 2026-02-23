/** Derives initials from full name or email for avatar display. */
export function getUserInitials(
  fullName: string | null | undefined,
  email: string | null | undefined
): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  if (email) {
    const local = email.split("@")[0];
    if (local.length >= 2) return local.slice(0, 2).toUpperCase();
    return local[0].toUpperCase();
  }
  return "U";
}

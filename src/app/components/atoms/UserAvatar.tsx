import { Avatar, AvatarFallback } from "../ui/avatar";
import { getUserInitials } from "../../lib/user";

interface UserAvatarProps {
  fullName?: string | null;
  email?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  fullName,
  email,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const initials = getUserInitials(fullName, email);
  return (
    <Avatar className={className}>
      <AvatarFallback
        className={fallbackClassName}
        aria-hidden
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

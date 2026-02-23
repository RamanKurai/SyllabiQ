import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserAvatar } from "../atoms/UserAvatar";
import { cn } from "../ui/utils";

interface UserMenuProps {
  fullName?: string | null;
  email?: string | null;
  roles?: string[];
  onLogout: () => void;
  triggerClassName?: string;
  /** Label for the trigger button (accessibility) */
  triggerLabel?: string;
}

export function UserMenu({
  fullName,
  email,
  roles = [],
  onLogout,
  triggerClassName,
  triggerLabel = "User menu",
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-full outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            triggerClassName
          )}
          aria-label={triggerLabel}
          aria-haspopup="menu"
        >
          <UserAvatar
            fullName={fullName}
            email={email}
            className="size-9"
            fallbackClassName="bg-primary/10 text-primary text-sm font-medium"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <UserAvatar
                  fullName={fullName}
                  email={email}
                  className="size-10 shrink-0"
                  fallbackClassName="bg-primary/10 text-primary text-sm font-medium"
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{fullName || "—"}</span>
                  <span className="truncate text-sm text-muted-foreground">{email || ""}</span>
                </div>
              </div>
              {roles.length > 0 && (
                <span className="text-xs text-muted-foreground">{roles.join(", ")}</span>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
          >
            <LogOut className="size-4 mr-2" aria-hidden />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

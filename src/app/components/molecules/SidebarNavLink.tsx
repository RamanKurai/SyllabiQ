import { NavLink } from "react-router-dom";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";

interface SidebarNavLinkProps {
  to: string;
  end?: boolean;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  isActive: boolean;
  tooltip: string;
}

export function SidebarNavLink({
  to,
  end,
  icon: Icon,
  label,
  isActive,
  tooltip,
}: SidebarNavLinkProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={tooltip}>
      <NavLink to={to} end={end}>
        <Icon className="size-4" aria-hidden />
        {!isCollapsed && <span>{label}</span>}
      </NavLink>
    </SidebarMenuButton>
  );
}

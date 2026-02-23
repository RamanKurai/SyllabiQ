import { NavLink } from "react-router-dom";
import {
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../ui/utils";

export type ContentSubItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  to: string;
};

interface AdminNavItemWithSubProps {
  icon: React.ReactNode;
  label: string;
  subItems: ContentSubItem[];
  pathname: string;
  navigate: (to: string) => void;
}

export function AdminNavItemWithSub({
  icon,
  label,
  subItems,
  pathname,
  navigate,
}: AdminNavItemWithSubProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isContentActive = pathname.startsWith("/admin/content");

  if (isCollapsed) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-haspopup="menu"
            aria-label={label}
            title={label}
            data-slot="sidebar-menu-button"
            data-sidebar="menu-button"
            data-size="default"
            data-active={isContentActive}
            className={cn(
              "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]/sidebar-wrapper:size-8! group-data-[collapsible=icon]/sidebar-wrapper:p-2! group-data-[collapsible=icon]/sidebar-wrapper:justify-center [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 appearance-none bg-transparent font-inherit",
              "h-8 text-sm",
              isContentActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            )}
          >
            {icon}
            <span className="sr-only">{label}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={4}
          collisionPadding={16}
          avoidCollisions
          className="min-w-[11rem] z-[100]"
        >
          {subItems.map((item) => (
            <DropdownMenuItem
              key={item.key}
              onSelect={() => navigate(item.to)}
              className="flex cursor-pointer items-center gap-2"
            >
              <item.icon className="size-4" aria-hidden />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <SidebarMenuButton asChild isActive={isContentActive} tooltip={label}>
        <NavLink to="/admin/content/departments">
          {icon}
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
      <SidebarMenuSub>
        {subItems.map((item) => (
          <SidebarMenuSubItem key={item.key}>
            <SidebarMenuSubButton asChild isActive={pathname === item.to}>
              <NavLink to={item.to}>
                <item.icon className="size-4" aria-hidden />
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </>
  );
}

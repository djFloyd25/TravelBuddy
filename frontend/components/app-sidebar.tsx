"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, MapIcon, Settings, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "My Trips",
    url: "/dashboard",
    icon: MapIcon,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <MapIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">TravelBuddy</p>
            <p className="text-xs text-muted-foreground">Plan Together</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Link
          href="/dashboard/account"
          className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
        >
          <div className="rounded-full bg-primary/10 p-2">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium">Account</p>
            <p className="text-xs text-muted-foreground">Manage profile</p>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Collapsible } from "./collapsible";
import { Separator } from "./separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { usePathname } from "next/navigation";
import { Book, HeartPulse, Home, Syringe } from "lucide-react";

const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    isActive: true,
  },
  {
    title: "Doctor Dashboard",
    url: "/dashboard",
    icon: Syringe,
    isActive: true,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Book,
    isActive: true,
  },
];
const Doctor = [
  {
    id: "1",
    name: "Chaminda",
    email: "chaminda@example.com",
    specialization: "Dental",
  },
];
const Patient = [
  {
    id: "01",
    name: "Sandaru",
    email: "sandaru@example.com",
  },
];

export function AppSidebar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="border border-transparent hover:border-gray-500/20 transition-colors"
                size="lg"
                asChild
              >
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                    <HeartPulse className="size-6 text-primary" />
                  </div>
                  <h1 className="text-3xl text-blue-500 font-bold">
                    Medi<span className="text-rose-500">Help</span>
                  </h1>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Separator className="my-2" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explore</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        {}
        <SidebarFooter>
          {pathName === "/" ? (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{Patient[0].name}</h1>
              <h1 className="text-l">{Patient[0].email}</h1>
            </div>
          ) : (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{Doctor[0].name}</h1>
              <h1 className="text-l">{Doctor[0].email}</h1>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 w-full justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 scale-125" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {pathName.toUpperCase().split("/")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

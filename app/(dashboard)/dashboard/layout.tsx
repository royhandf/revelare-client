"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const userName = "Royhan Daffa";
const userEmail = "admin-semantic@revelare.com";
const initials = getInitials(userName);

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Book List",
    href: "/dashboard/book-list",
  },
  {
    name: "User List",
    href: "/dashboard/user-list",
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full shadow-xs bg-white">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <Image src="/images/book.png" alt="Logo" width={24} height={24} />
            <span className="text-purple-600">Revelare</span>
          </Link>

          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-normal transition-colors hover:text-violet-600",
                      isActive
                        ? "text-violet-600 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-auto px-1.5 gap-1.5 flex items-center"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-teal-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-gray-600">
                  {userName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/signin" })}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

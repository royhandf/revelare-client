"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs bg-white">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <Image src="/images/book.png" alt="Logo" width={24} height={24} />
          <span className="text-purple-600">Revelare</span>
        </Link>

        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-auto px-1.5 gap-1.5 flex items-center"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-teal-500 text-white">
                    {getInitials(session.user.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-gray-600">
                  {session.user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/bookmark">
                <DropdownMenuItem>Bookmark</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              Sign Up
            </Link>
            <Button
              asChild
              size="sm"
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

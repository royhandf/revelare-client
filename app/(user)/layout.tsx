import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Bookmark, LogOut } from "lucide-react";

// Mock user data - nanti diambil dari auth context
const mockUser = {
  name: "Royhan Daffa",
  email: "royhan@example.com",
  avatar: null,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full shadow-xs bg-white">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Image src="/images/book.png" alt="Logo" width={24} height={24} />
            <span className="text-purple-600">Revelare</span>
          </Link>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-medium">
                {getInitials(mockUser.name)}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {mockUser.name}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href="/profil"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/bookmark"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Bookmark className="h-4 w-4" />
                  Bookmark
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-red-600 cursor-pointer">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

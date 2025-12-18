import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GuestLayout({
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

          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button
                variant="ghost"
                className="text-violet-600 hover:text-violet-700"
              >
                Sign Up
              </Button>
            </Link>
            <Link href="/signin">
              <Button className="bg-violet-600 hover:bg-violet-700">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

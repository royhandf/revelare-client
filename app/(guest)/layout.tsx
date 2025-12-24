import { Navbar } from "@/components/navbar";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

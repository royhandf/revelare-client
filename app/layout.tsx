import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";

const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast: "bg-white border border-gray-200 shadow-lg",
                title: "text-gray-900",
                description: "text-gray-600",
                success: "!bg-green-50 !border-green-200 !text-green-900",
                error: "!bg-red-50 !border-red-200 !text-red-900",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

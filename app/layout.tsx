import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex justify-center">
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}

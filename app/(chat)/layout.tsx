import Link from "next/link";
import type { ReactNode } from "react";

const navLinks = [
  { href: "/chat-basic", label: "Chat Basic" },
  { href: "/chat-transaction", label: "Chat Transaction" },
  { href: "/chat-flight", label: "Chat Flight" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <nav className="mb-10 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-neutral-500">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-neutral-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <main className="w-full max-w-2xl">{children}</main>

      <Link
        href="/"
        className="transition-colors hover:text-neutral-900 text-neutral-500 mt-10"
      >
        Home
      </Link>
    </div>
  );
}

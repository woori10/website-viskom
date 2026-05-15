"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dictionary", label: "Dictionary" },
  { href: "/practice", label: "Practice" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-300 bg-(--color-secondary)">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <h1 className="text-lg font-bold text-(--color-primary)">
          KataHira Learn
        </h1>

        {/* Menu */}
        <nav className="flex gap-6">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  active
                    ? "text-(--color-primary)"
                    : "text-(--color-text-secondary) hover:text-(--color-primary)"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

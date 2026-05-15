"use client";

import { BookOpenCheck, Home, Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dictionary", label: "Dictionary", icon: Languages },
  { href: "/practice", label: "Practice", icon: BookOpenCheck },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t border-gray-300 bg-secondary">
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs ${
              active ? "text-primary" : "text-text-secondary"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

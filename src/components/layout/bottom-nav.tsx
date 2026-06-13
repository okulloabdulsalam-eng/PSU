"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, HelpCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/questions", icon: HelpCircle, label: "Questions" },
  { href: "/settings", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav safe-bottom">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn("bottom-nav-item", active && "active")}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

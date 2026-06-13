"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Home, BookOpen, HelpCircle, TrendingUp, Bookmark,
  Settings, Shield, Users, FileText, Video, BarChart2
} from "lucide-react";

const studentNav = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/questions", icon: HelpCircle, label: "Question Bank" },
  { href: "/progress", icon: TrendingUp, label: "My Progress" },
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const adminNav = [
  { href: "/admin", icon: BarChart2, label: "Dashboard" },
  { href: "/admin/notes", icon: FileText, label: "Notes Editor" },
  { href: "/admin/questions", icon: HelpCircle, label: "Questions" },
  { href: "/admin/videos", icon: Video, label: "Videos" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";
  const navItems = isAdmin ? [...adminNav, ...studentNav] : studentNav;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50",
          "transform transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:static md:h-auto md:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-sora font-bold text-dark">PharmaPrep</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {isAdmin && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-2">Admin</p>
              {adminNav.map((item) => (
                <NavItem key={item.href} {...item} active={pathname === item.href || pathname.startsWith(item.href + "/")} onClick={onClose} />
              ))}
              <div className="h-px bg-border my-4" />
              <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-2">Student View</p>
            </div>
          )}
          {studentNav.map((item) => (
            <NavItem key={item.href} {...item} active={pathname === item.href || pathname.startsWith(item.href + "/")} onClick={onClose} />
          ))}
        </nav>
      </aside>
    </>
  );
}

function NavItem({ href, icon: Icon, label, active, onClick }: {
  href: string; icon: any; label: string; active: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px]",
        active
          ? "bg-primary-50 text-primary-600 font-semibold"
          : "text-muted hover:bg-background hover:text-dark"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary-500" : "")} />
      {label}
    </Link>
  );
}

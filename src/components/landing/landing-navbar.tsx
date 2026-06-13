"use client";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-sora font-bold text-dark">PharmaPrep Uganda</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted hover:text-dark transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-muted hover:text-dark transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-muted hover:text-dark transition-colors">FAQ</a>
            {session ? (
              <Button size="sm" asChild><Link href="/dashboard">Go to Dashboard</Link></Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild><Link href="/login">Login</Link></Button>
                <Button size="sm" asChild><Link href="/register">Get Started Free</Link></Button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-border space-y-2">
            <a href="#features" className="block px-4 py-2.5 text-sm font-medium text-muted hover:text-dark" onClick={() => setOpen(false)}>Features</a>
            <a href="#pricing" className="block px-4 py-2.5 text-sm font-medium text-muted hover:text-dark" onClick={() => setOpen(false)}>Pricing</a>
            <a href="#faq" className="block px-4 py-2.5 text-sm font-medium text-muted hover:text-dark" onClick={() => setOpen(false)}>FAQ</a>
            <div className="flex flex-col gap-2 px-4 pt-2">
              {session ? (
                <Button asChild><Link href="/dashboard">Go to Dashboard</Link></Button>
              ) : (
                <>
                  <Button variant="outline" asChild><Link href="/login">Login</Link></Button>
                  <Button asChild><Link href="/register">Get Started Free</Link></Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

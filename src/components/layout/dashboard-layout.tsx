"use client";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { BottomNav } from "./bottom-nav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </div>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

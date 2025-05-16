"use client";

import { ThemeProvider } from '@/components/theme-provider';
import Link from 'next/link';
import { LucideHome, LucideUsers, LucideFileText, LucideZap } from 'lucide-react';

// Simple SidebarLink component
function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-gray-900 text-white p-4 hidden md:block">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">AutoFlow</h1>
          </div>
          <nav className="space-y-2">
            <SidebarLink href="/" icon={<LucideHome size={20} />} label="Home" />
            <SidebarLink href="/dashboard" icon={<LucideHome size={20} />} label="Dashboard" />
            <SidebarLink href="/clients" icon={<LucideUsers size={20} />} label="Clients" />
            <SidebarLink href="/invoices" icon={<LucideFileText size={20} />} label="Invoices" />
            <SidebarLink href="/automation" icon={<LucideZap size={20} />} label="Automation" />
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
} 
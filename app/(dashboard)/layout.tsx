import Link from "next/link";
import { LucideHome, LucideUsers, LucideFileText, LucideZap, LucideMail } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">AutoFlow</h1>
        </div>
        <nav className="space-y-2">
          <SidebarLink href="/dashboard" icon={<LucideHome size={20} />} label="Dashboard" />
          <SidebarLink href="/clients" icon={<LucideUsers size={20} />} label="Clients" />
          <SidebarLink href="/invoices" icon={<LucideFileText size={20} />} label="Invoices" />
          <SidebarLink href="/automation" icon={<LucideZap size={20} />} label="Automation" />
          <SidebarLink href="/email-templates" icon={<LucideMail size={20} />} label="Email Templates" />
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-50">
        <header className="bg-white shadow">
          <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">AutoFlow</h1>
          </div>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}

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
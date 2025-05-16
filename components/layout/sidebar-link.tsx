"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export function SidebarLink({ href, icon, label }: SidebarLinkProps) {
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
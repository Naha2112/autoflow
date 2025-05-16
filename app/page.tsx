import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Welcome to AutoFlow</h1>
      <p className="mb-8">Your automated invoicing and client management system</p>
      
      <div className="flex gap-4">
        <a 
          href="/simple" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Visit Simple Page
        </a>
      </div>
    </div>
  );
} 
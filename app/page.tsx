import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to AutoFlow</CardTitle>
          <CardDescription className="text-lg mt-2">
            Your automated invoicing and client management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            AutoFlow helps you manage clients, create invoices, and automate your workflow.
          </p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Access Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/api/health">Check API Health</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
} 
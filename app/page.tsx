import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome to AutoFlow</CardTitle>
            <CardDescription>
              Your automated invoicing and client management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This platform helps you streamline your business processes, manage clients, create invoices, and automate repetitive tasks.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <a href="/api/health">Check API Health</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
} 
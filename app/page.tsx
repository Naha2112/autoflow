import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex-1 p-6">
      {/* Welcome Section */}
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to AutoFlow</CardTitle>
          <CardDescription className="text-lg mt-2">
            Your automated invoicing and client management system
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dashboard Section */}
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Open invoices</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/invoices">View All</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Manage your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active clients</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/clients">View All</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Automation</CardTitle>
            <CardDescription>Manage your automations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active automations</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/automation">Configure</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
} 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
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
              <a href="/invoices">View All</a>
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
              <a href="/clients">View All</a>
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
              <a href="/automation">Configure</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 
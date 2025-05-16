import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button>Create New Invoice</Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>Manage all your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No invoices created yet.</p>
            <Button>Create Your First Invoice</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button>Add New Client</Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>Manage your clients and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No clients added yet.</p>
            <Button>Add Your First Client</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
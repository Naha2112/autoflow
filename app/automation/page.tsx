import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AutomationPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Automation</h1>
        <Button>Create New Workflow</Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Automation Workflows</CardTitle>
          <CardDescription>Set up automated processes for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No automation workflows set up yet.</p>
            <Button>Create Your First Workflow</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Common Templates</CardTitle>
            <CardDescription>Get started with pre-built automations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-50 rounded cursor-pointer">Invoice Reminders</li>
              <li className="p-2 hover:bg-gray-50 rounded cursor-pointer">Welcome New Clients</li>
              <li className="p-2 hover:bg-gray-50 rounded cursor-pointer">Payment Thank You</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Automation Metrics</CardTitle>
            <CardDescription>Track the performance of your automations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Set up your first automation to see metrics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
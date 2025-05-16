import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
              <li className="p-3 hover:bg-gray-100 rounded cursor-pointer flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <span>1</span>
                </div>
                <div>
                  <p className="font-medium">Invoice Reminders</p>
                  <p className="text-sm text-gray-500">Send automated reminders for unpaid invoices</p>
                </div>
              </li>
              <li className="p-3 hover:bg-gray-100 rounded cursor-pointer flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                  <span>2</span>
                </div>
                <div>
                  <p className="font-medium">Welcome New Clients</p>
                  <p className="text-sm text-gray-500">Automatically send welcome emails to new clients</p>
                </div>
              </li>
              <li className="p-3 hover:bg-gray-100 rounded cursor-pointer flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                  <span>3</span>
                </div>
                <div>
                  <p className="font-medium">Payment Thank You</p>
                  <p className="text-sm text-gray-500">Send thank you emails after payment receipt</p>
                </div>
              </li>
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
              <p className="text-muted-foreground mb-4">Set up your first automation to see metrics</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-500">Messages Sent</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold">0%</p>
                  <p className="text-sm text-gray-500">Open Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
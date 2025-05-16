import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AutomationPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Automation Builder</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">Create New Workflow</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Workflow Designer</CardTitle>
              <CardDescription>Drag and drop elements to build your automation</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gray-100 rounded-lg p-8 min-h-[600px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative">
                <div className="absolute top-4 left-4 right-4 flex justify-between bg-white p-3 rounded-md shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Invoice Reminder Workflow</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Save</Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Activate</Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-6 w-full max-w-md mt-16">
                  {/* Trigger Node */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.3"></path><path d="M10.3 21h3.4"></path><path d="M13.7 3h5.3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.3"></path><path d="M10.3 12h3.4"></path><path d="M6 12h.01"></path><path d="M18 12h.01"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Trigger: Invoice Due</h3>
                        <p className="text-sm text-gray-500">When invoice is due in 3 days</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  <div className="flex justify-center">
                    <div className="h-10 border-l-2 border-gray-300"></div>
                  </div>
                  
                  {/* Action Node */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 4.6a2 2 0 0 1 1.4-.6H20a2 2 0 0 1 2 2v1.4c0 .63-.3 1.22-.8 1.6"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Action: Send Email</h3>
                        <p className="text-sm text-gray-500">Send invoice reminder template</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  <div className="flex justify-center">
                    <div className="h-10 border-l-2 border-gray-300"></div>
                  </div>
                  
                  {/* Condition Node */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5-7 7 7 7"></path><path d="m17 5 7 7-7 7"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Condition: Payment Received?</h3>
                        <p className="text-sm text-gray-500">Check if payment was made</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* New node button */}
                  <Button variant="outline" className="border-dashed border-2 hover:border-blue-400 mt-4">
                    + Add Another Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Workflow Elements</CardTitle>
              <CardDescription>Drag these elements to the designer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">T</div>
                    <span className="font-medium">Trigger</span>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">A</div>
                    <span className="font-medium">Action</span>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">C</div>
                    <span className="font-medium">Condition</span>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">D</div>
                    <span className="font-medium">Delay</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Available Templates</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium">Invoice Reminder</h4>
                    <p className="text-sm text-gray-500">Automatically remind clients about due invoices</p>
                  </div>
                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium">Welcome New Client</h4>
                    <p className="text-sm text-gray-500">Send welcome emails to new clients</p>
                  </div>
                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium">Payment Thank You</h4>
                    <p className="text-sm text-gray-500">Thank clients after receiving payment</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Workflow Settings</CardTitle>
              <CardDescription>Configure your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Workflow Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Invoice Reminder Workflow"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Automatically send reminders for unpaid invoices"
                    rows={3}
                  ></textarea>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active</span>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input type="checkbox" id="active" className="sr-only" />
                    <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Workflow</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"

export default function NewInvoicePage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  )
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, amount: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Calculate amount if quantity or rate changes
    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }

    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to invoices page
    router.push("/invoices")
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Create New Invoice</h1>
        <Button variant="outline" asChild>
          <Link href="/invoices">Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Invoice Details</TabsTrigger>
            <TabsTrigger value="items">Line Items</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Information</CardTitle>
                <CardDescription>Enter the basic details for this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input id="invoice-number" defaultValue="INV-009" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Select defaultValue="new">
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Add New Client</SelectItem>
                        <SelectItem value="acme">Acme Inc</SelectItem>
                        <SelectItem value="globex">Globex Corp</SelectItem>
                        <SelectItem value="stark">Stark Industries</SelectItem>
                        <SelectItem value="wayne">Wayne Enterprises</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Invoice Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes for this invoice"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>Add the products or services you're invoicing for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 sm:col-span-5">
                      <Label htmlFor={`item-${index}-desc`} className="text-xs">
                        Description
                      </Label>
                      <Input
                        id={`item-${index}-desc`}
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Label htmlFor={`item-${index}-qty`} className="text-xs">
                        Quantity
                      </Label>
                      <Input
                        id={`item-${index}-qty`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Label htmlFor={`item-${index}-rate`} className="text-xs">
                        Rate
                      </Label>
                      <Input
                        id={`item-${index}-rate`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(index, "rate", Number.parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <Label className="text-xs">Amount</Label>
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 text-right">
                        ${(item.quantity * item.rate).toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>

                <div className="flex flex-col items-end space-y-2 pt-4">
                  <div className="flex w-full justify-between border-t pt-2 sm:w-1/3">
                    <span className="font-medium">Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex w-full justify-between sm:w-1/3">
                    <span className="font-medium">Tax (0%):</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex w-full justify-between border-t pt-2 sm:w-1/3">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>Configure additional settings for this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select defaultValue="14">
                    <SelectTrigger id="payment-terms">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Due in 7 days</SelectItem>
                      <SelectItem value="14">Due in 14 days</SelectItem>
                      <SelectItem value="30">Due in 30 days</SelectItem>
                      <SelectItem value="60">Due in 60 days</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurring">Recurring Invoice</Label>
                  <Select defaultValue="no">
                    <SelectTrigger id="recurring">
                      <SelectValue placeholder="Is this a recurring invoice?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-template">Email Template</Label>
                  <Select defaultValue="default">
                    <SelectTrigger id="email-template">
                      <SelectValue placeholder="Select email template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Invoice Template</SelectItem>
                      <SelectItem value="friendly">Friendly Reminder</SelectItem>
                      <SelectItem value="formal">Formal Business</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/invoices">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  )
}

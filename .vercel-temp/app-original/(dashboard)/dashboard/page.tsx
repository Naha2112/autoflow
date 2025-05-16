"use client";

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, DollarSign, Clock, CheckCircle2, AlertCircle, Plus, Loader2 } from "lucide-react"

interface Client {
  id: string;
  name: string;
  email: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client: { name: string; email: string };
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [emailTemplates, setEmailTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    revenue: 0,
    pendingCount: 0,
    pendingAmount: 0,
    paidCount: 0,
    overdueCount: 0,
    overdueAmount: 0
  })

  // Fetch invoices and calculate stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch invoices
        const invoicesRes = await fetch("/api/invoices")
        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json()
          setInvoices(invoicesData)
          
          // Calculate dashboard stats
          const revenue = invoicesData
            .filter((inv: Invoice) => inv.status === "PAID")
            .reduce((sum: number, inv: Invoice) => sum + inv.total, 0)
          
          const pendingInvoices = invoicesData.filter((inv: Invoice) => inv.status === "SENT")
          const pendingAmount = pendingInvoices.reduce((sum: number, inv: Invoice) => sum + inv.total, 0)
          
          const overdueInvoices = invoicesData.filter((inv: Invoice) => inv.status === "OVERDUE")
          const overdueAmount = overdueInvoices.reduce((sum: number, inv: Invoice) => sum + inv.total, 0)
          
          const paidInvoices = invoicesData.filter((inv: Invoice) => inv.status === "PAID")
          
          setStats({
            revenue,
            pendingCount: pendingInvoices.length,
            pendingAmount,
            paidCount: paidInvoices.length,
            overdueCount: overdueInvoices.length,
            overdueAmount
          })
        }
        
        // Fetch email templates
        const emailsRes = await fetch("/api/email-templates")
        if (emailsRes.ok) {
          const emailsData = await emailsRes.json()
          setEmailTemplates(emailsData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {stats.paidCount} paid invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">${stats.pendingAmount.toFixed(2)} outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidCount}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueCount}</div>
            <p className="text-xs text-muted-foreground">${stats.overdueAmount.toFixed(2)} overdue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
          <TabsTrigger value="emails">Recent Emails</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Overview of your latest invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No invoices found. Create your first invoice to get started.
                  </p>
                )}
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="grid gap-1">
                      <div className="font-semibold">{invoice.client.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.invoiceNumber} · {new Date(invoice.issueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">${invoice.total.toFixed(2)}</div>
                      <Badge invoice={invoice} />
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/invoices/${invoice.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="sr-only">View invoice</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {invoices.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href="/invoices">View all invoices</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Your reusable email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No email templates found. Create your first template to get started.
                  </p>
                )}
                {emailTemplates.slice(0, 5).map((template) => (
                  <div key={template.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="grid gap-1">
                      <div className="font-semibold">{template.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {template.subject}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/email-templates/${template.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="sr-only">View template</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {emailTemplates.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href="/email-templates">View all templates</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Badge({ invoice }: { invoice: { status: string } }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "PENDING":
      case "SENT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "OVERDUE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(invoice.status)}`}>
      {invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}
    </span>
  )
}

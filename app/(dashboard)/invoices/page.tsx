"use client";

import { useState, useEffect } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowUpDown,
  Eye,
  FileEdit,
  FileText,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  Search
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client: {
    name: string;
    email: string;
  };
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch invoices
  useEffect(() => {
    async function fetchInvoices() {
      try {
        const response = await fetch("/api/invoices");
        
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to load invoices. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchInvoices();
  }, []);

  // Filter and sort invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchTermLower) ||
      invoice.client.name.toLowerCase().includes(searchTermLower) ||
      invoice.client.email.toLowerCase().includes(searchTermLower) ||
      invoice.status.toLowerCase().includes(searchTermLower)
    );
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === "total") {
      valueA = a.total;
      valueB = b.total;
    } else if (sortBy === "dueDate") {
      valueA = new Date(a.dueDate).getTime();
      valueB = new Date(b.dueDate).getTime();
    } else if (sortBy === "issueDate") {
      valueA = new Date(a.issueDate).getTime();
      valueB = new Date(b.issueDate).getTime();
    } else if (sortBy === "client") {
      valueA = a.client.name.toLowerCase();
      valueB = b.client.name.toLowerCase();
    } else {
      valueA = new Date(a.createdAt).getTime();
      valueB = new Date(b.createdAt).getTime();
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Sort toggle handler
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <div className="rounded-md border">
                <div className="h-10 px-4 border-b flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-4 w-24 mx-4" />
                  ))}
                </div>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-16 px-4 border-b flex items-center">
                    {[...Array(5)].map((_, cellIndex) => (
                      <Skeleton key={cellIndex} className="h-4 w-24 mx-4" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>Manage and track all your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {invoices.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first invoice to start tracking your business income
                </p>
                <Button asChild>
                  <Link href="/invoices/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => toggleSort("invoiceNumber")} className="cursor-pointer">
                        Invoice #
                        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortBy === "invoiceNumber" ? "opacity-100" : "opacity-50"}`} />
                      </TableHead>
                      <TableHead onClick={() => toggleSort("client")} className="cursor-pointer">
                        Client
                        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortBy === "client" ? "opacity-100" : "opacity-50"}`} />
                      </TableHead>
                      <TableHead onClick={() => toggleSort("issueDate")} className="cursor-pointer">
                        Issue Date
                        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortBy === "issueDate" ? "opacity-100" : "opacity-50"}`} />
                      </TableHead>
                      <TableHead onClick={() => toggleSort("dueDate")} className="cursor-pointer">
                        Due Date
                        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortBy === "dueDate" ? "opacity-100" : "opacity-50"}`} />
                      </TableHead>
                      <TableHead onClick={() => toggleSort("total")} className="cursor-pointer text-right">
                        Total
                        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortBy === "total" ? "opacity-100" : "opacity-50"}`} />
                      </TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.client.name}</TableCell>
                        <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">${invoice.total.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/invoices/${invoice.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/invoices/${invoice.id}/edit`}>
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/invoices/${invoice.id}/send`}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Invoice
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "SENT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "DRAFT":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
      case "OVERDUE":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "CANCELLED":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <Badge className={getStatusStyles()} variant="outline">
      {getStatusText()}
    </Badge>
  );
}

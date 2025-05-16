"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  FileText, 
  Loader2, 
  Mail, 
  Plus, 
  Settings, 
  ToggleLeft, 
  ToggleRight 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EmailTemplate {
  id: string;
  name: string;
}

interface Automation {
  id: string;
  name: string;
  trigger: string;
  emailTemplateId: string | null;
  emailTemplate: EmailTemplate | null;
  active: boolean;
  createdAt: string;
}

export default function AutomationPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch automations
  useEffect(() => {
    async function fetchAutomations() {
      try {
        const response = await fetch("/api/automations");
        
        if (!response.ok) {
          throw new Error("Failed to fetch automations");
        }
        
        const data = await response.json();
        setAutomations(data);
      } catch (err) {
        console.error("Error fetching automations:", err);
        setError("Failed to load automations. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchAutomations();
  }, []);

  // Toggle automation active status
  const toggleAutomation = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/automations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update automation");
      }

      // Update local state
      setAutomations(
        automations.map((auto) =>
          auto.id === id ? { ...auto, active: !currentActive } : auto
        )
      );
    } catch (err) {
      console.error("Error updating automation:", err);
      // Show error message
    }
  };

  // Get trigger display name
  const getTriggerDisplayName = (trigger: string) => {
    switch (trigger) {
      case "INVOICE_CREATED":
        return "Invoice Created";
      case "INVOICE_SENT":
        return "Invoice Sent";
      case "INVOICE_PAID":
        return "Invoice Paid";
      case "INVOICE_OVERDUE":
        return "Invoice Overdue";
      case "SCHEDULED":
        return "Scheduled";
      default:
        return trigger;
    }
  };

  // Get trigger icon
  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "INVOICE_CREATED":
      case "INVOICE_SENT":
      case "INVOICE_PAID":
      case "INVOICE_OVERDUE":
        return <FileText className="h-10 w-10 text-blue-500" />;
      case "SCHEDULED":
        return <Clock className="h-10 w-10 text-amber-500" />;
      default:
        return <Settings className="h-10 w-10 text-gray-500" />;
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
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Automation</h1>
          <Button asChild>
            <Link href="/automation/new">
              <Plus className="mr-2 h-4 w-4" />
              New Automation
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
        <h1 className="text-2xl font-bold">Automation</h1>
        <Button asChild>
          <Link href="/automation/new">
            <Plus className="mr-2 h-4 w-4" />
            New Automation
          </Link>
        </Button>
      </div>

      {automations.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No automations yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first automation to streamline your workflow
          </p>
          <Button asChild>
            <Link href="/automation/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Automation
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {automations.map((automation) => (
            <Card key={automation.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    {getTriggerIcon(automation.trigger)}
                    <div>
                      <CardTitle className="text-lg">{automation.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Trigger: {getTriggerDisplayName(automation.trigger)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={automation.active}
                      onCheckedChange={() => toggleAutomation(automation.id, automation.active)}
                      aria-label={`${automation.active ? "Disable" : "Enable"} automation`}
                    />
                    <Label className="text-xs text-muted-foreground">
                      {automation.active ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center">
                          <ToggleRight className="h-4 w-4 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center">
                          <ToggleLeft className="h-4 w-4 mr-1" />
                          Inactive
                        </span>
                      )}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-4">
                  {automation.emailTemplateId ? (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Uses template: </span>
                      <Badge variant="secondary" className="ml-2">
                        <Link href={`/email-templates/${automation.emailTemplateId}`}>
                          {automation.emailTemplate?.name || "Unknown template"}
                        </Link>
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>No email template assigned</span>
                    </div>
                  )}
                  <div className="flex justify-end pt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/automation/${automation.id}/edit`}>
                        Edit Automation
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

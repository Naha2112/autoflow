"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowUpRight, Loader2 } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch("/api/email-templates");
        
        if (!response.ok) {
          throw new Error("Failed to fetch email templates");
        }
        
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error("Error fetching email templates:", err);
        setError("Failed to load email templates. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <Button asChild>
            <Link href="/email-templates/new">
              <Plus className="mr-2 h-4 w-4" />
              New Template
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
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Button asChild>
          <Link href="/email-templates/new">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Link>
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No email templates yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first email template to start automating your communications
          </p>
          <Button asChild>
            <Link href="/email-templates/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold truncate">{template.name}</h3>
                    <Button variant="ghost" size="icon" asChild className="ml-2 -mr-2 -mt-2">
                      <Link href={`/email-templates/${template.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">View template</span>
                      </Link>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {template.subject}
                  </p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="border-t p-4 bg-muted/50 flex justify-between">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/email-templates/${template.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/email-templates/${template.id}/preview`}>
                      Preview
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

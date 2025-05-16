import { NextRequest, NextResponse } from "next/server";
import { automationEngine } from "@/lib/automation-engine";

// This route should be protected in production with a secret key
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    
    // Validate secret to ensure only authorized calls can run the job
    if (!secret || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Process overdue invoices
    await automationEngine.processOverdueInvoices();
    
    return NextResponse.json({ success: true, message: "Overdue invoices processed successfully" });
  } catch (error) {
    console.error("[CRON_CHECK_OVERDUE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { runAudit } from "@/lib/audit-engine";
import { supabase, isMockMode } from "@/lib/supabase";
import { AuditFormData } from "@/lib/types";

const inMemoryStore = new Map<string, object>();

export async function POST(req: NextRequest) {
  try {
    const body: AuditFormData = await req.json();

    if (!body.tools || !Array.isArray(body.tools) || body.tools.length === 0) {
      return NextResponse.json({ error: "No tools provided" }, { status: 400 });
    }

    const { recommendations, totalMonthlySavings, totalAnnualSavings } = runAudit(body);

    const id = nanoid(10);

    const auditRecord = {
      id,
      tools: body.tools,
      team_size: body.teamSize,
      use_case: body.useCase,
      recommendations,
      total_monthly_savings: totalMonthlySavings,
      total_annual_savings: totalAnnualSavings,
      ai_summary: "",
      created_at: new Date().toISOString(),
    };

    if (isMockMode || !supabase) {
      inMemoryStore.set(id, auditRecord);
    } else {
      const { error } = await supabase.from("audits").insert([auditRecord]);
      if (error) {
        console.error("Supabase insert error:", error);
        inMemoryStore.set(id, auditRecord);
      }
    }

    return NextResponse.json({ id, totalMonthlySavings, totalAnnualSavings });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export { inMemoryStore };

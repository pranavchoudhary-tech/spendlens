import { NextRequest, NextResponse } from "next/server";
import { supabase, isMockMode } from "@/lib/supabase";
import { inMemoryStore } from "@/app/api/audit/route";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing audit ID" }, { status: 400 });
  }

  if (isMockMode || !supabase) {
    const record = inMemoryStore.get(id);
    if (!record) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  }

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  const publicRecord = {
    id: data.id,
    tools: data.tools,
    team_size: data.team_size,
    use_case: data.use_case,
    recommendations: data.recommendations,
    total_monthly_savings: data.total_monthly_savings,
    total_annual_savings: data.total_annual_savings,
    ai_summary: data.ai_summary,
    created_at: data.created_at,
  };

  return NextResponse.json(publicRecord);
}

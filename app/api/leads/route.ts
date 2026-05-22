import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase, isMockMode } from "@/lib/supabase";
import { LeadData } from "@/lib/types";

const resendApiKey = process.env.RESEND_API_KEY;
const isEmailMockMode = !resendApiKey || resendApiKey === "placeholder";

const emailRateMap = new Map<string, number>();

function isRateLimited(email: string): boolean {
  const lastSubmit = emailRateMap.get(email);
  if (!lastSubmit) return false;
  return Date.now() - lastSubmit < 60 * 60 * 1000;
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadData & { totalMonthlySavings?: number } = await req.json();

    if (!body.email || !body.auditId) {
      return NextResponse.json(
        { error: "Email and auditId are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (isRateLimited(body.email)) {
      return NextResponse.json(
        { error: "Already submitted. Check your inbox." },
        { status: 429 }
      );
    }

    emailRateMap.set(body.email, Date.now());

    const isHighSavings = (body.totalMonthlySavings ?? 0) > 500;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://spendlens.vercel.app";
    const resultUrl = `${appUrl}/results/${body.auditId}`;

    if (!isMockMode && supabase) {
      await supabase.from("leads").insert([
        {
          audit_id: body.auditId,
          email: body.email,
          company_name: body.companyName ?? null,
          role: body.role ?? null,
          team_size: body.teamSize ?? null,
          high_savings: isHighSavings,
        },
      ]);
    }

    if (!isEmailMockMode) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "SpendLens <hello@spendlens.app>",
        to: body.email,
        subject: "Your AI spend audit is ready",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
            <div style="background: #060c18; padding: 32px; border-radius: 12px; margin-bottom: 24px;">
              <h1 style="color: #2dd4bf; font-size: 24px; margin: 0 0 8px;">Your audit is ready</h1>
              <p style="color: #94a3b8; margin: 0;">View your full AI spend breakdown and savings opportunities.</p>
            </div>
            <p><a href="${resultUrl}" style="display: inline-block; background: #2dd4bf; color: #060c18; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Full Audit →</a></p>
            ${
              isHighSavings
                ? `<p style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; color: #166534;">
                    <strong>High savings detected.</strong> A Credex advisor will reach out within 1 business day to walk through how to capture additional savings through discounted AI credits.
                  </p>`
                : ""
            }
            <p style="color: #64748b; font-size: 13px;">This link is permanent and shareable. It does not contain your email address.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, isHighSavings });
  } catch (err) {
    console.error("Lead capture error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

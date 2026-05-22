import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const savings = parseInt(searchParams.get("savings") ?? "0");

  const savingsText =
    savings > 0 ? `$${savings.toLocaleString()}/mo in savings found` : "Optimized AI stack";

  const html = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#060c18"/>
          <stop offset="100%" style="stop-color:#0a1020"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#2dd4bf"/>
          <stop offset="100%" style="stop-color:#60a5fa"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="200" cy="150" r="300" fill="#2dd4bf" fill-opacity="0.03"/>
      <circle cx="1000" cy="500" r="200" fill="#60a5fa" fill-opacity="0.04"/>
      <rect x="0" y="0" width="6" height="630" fill="#2dd4bf" fill-opacity="0.6"/>
      <text x="80" y="120" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#2dd4bf">SpendLens</text>
      <text x="80" y="200" font-family="system-ui, sans-serif" font-size="56" font-weight="800" fill="white">AI Spend Audit</text>
      <text x="80" y="290" font-family="system-ui, sans-serif" font-size="38" font-weight="600" fill="url(#accent)">${savingsText}</text>
      <text x="80" y="370" font-family="system-ui, sans-serif" font-size="24" fill="#64748b">Free · No login required · Results in 2 minutes</text>
      <rect x="80" y="440" width="280" height="56" rx="12" fill="#2dd4bf"/>
      <text x="220" y="474" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#060c18" text-anchor="middle">View Full Audit →</text>
      <text x="80" y="560" font-family="system-ui, sans-serif" font-size="18" fill="#334155">by credex.rocks</text>
    </svg>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

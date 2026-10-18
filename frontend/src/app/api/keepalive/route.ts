import { NextResponse } from "next/server";

// Render free instance'ları 15 dk boşta kalınca uyur; Vercel cron'u her 10 dk'da
// bir backend'i ping'leyerek avukatın soğuk başlatma beklemesini engeller.
export const dynamic = "force-dynamic";

export async function GET() {
  const backend =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://mizan-backend-rtl5.onrender.com";
  try {
    const res = await fetch(`${backend}/health`, { cache: "no-store" });
    return NextResponse.json({ ok: res.ok, status: res.status });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

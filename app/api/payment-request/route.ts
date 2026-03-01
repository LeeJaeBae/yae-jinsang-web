import { NextResponse } from "next/server";

const SUPABASE_URL = "https://jwxwjgcbarbfigucarod.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eHdqZ2NiYXJiZmlndWNhcm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjUyNTgsImV4cCI6MjA4NzQ0MTI1OH0.YtAbcj3j2AMTgV_iwi9ZgII8x0py0JTShsh0qX-FBGs";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

export async function POST(req: Request) {
  try {
    const { shop_id, amount, depositor_name, plan } = await req.json();

    if (!shop_id || !amount) {
      return NextResponse.json({ error: "shop_id, amount 필수" }, { status: 400 });
    }

    // 1. payment_requests에 저장
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/payment_requests`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        shop_id,
        amount,
        depositor_name: depositor_name || "미입력",
        plan: plan || "monthly",
        status: "pending",
      }),
    });

    const [inserted] = await insertRes.json();

    // 2. 업소 정보 조회
    const shopRes = await fetch(
      `${SUPABASE_URL}/rest/v1/shops?id=eq.${shop_id}&select=name,owner_phone`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const shops = await shopRes.json();
    const shop = shops?.[0];

    // 3. 디스코드 웹훅 전송
    if (DISCORD_WEBHOOK_URL) {
      const planLabel = plan === "yearly" ? "연간" : "월간";
      const msg = [
        `💰 **입금확인 요청**`,
        ``,
        `> 🏪 업소: **${shop?.name || shop_id}**`,
        `> 💵 금액: **${Number(amount).toLocaleString()}원**`,
        `> 📋 플랜: **${planLabel}**`,
        `> 🧾 입금자명: **${depositor_name || "미입력"}**`,
        `> 🕐 요청시간: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
        ``,
        `🆔 \`${inserted?.id}\``,
      ].join("\n");

      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: msg }),
      });
    }

    return NextResponse.json({ ok: true, id: inserted?.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

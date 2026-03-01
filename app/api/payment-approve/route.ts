import { NextResponse } from "next/server";

const SUPABASE_URL = "https://jwxwjgcbarbfigucarod.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eHdqZ2NiYXJiZmlndWNhcm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjUyNTgsImV4cCI6MjA4NzQ0MTI1OH0.YtAbcj3j2AMTgV_iwi9ZgII8x0py0JTShsh0qX-FBGs";

const ADMIN_SECRET = process.env.PAYMENT_ADMIN_SECRET || "jinsang-admin-2024";

export async function POST(req: Request) {
  try {
    const { id, action, secret } = await req.json();

    // 간단한 인증
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (!id || !action) {
      return NextResponse.json({ error: "id, action 필수" }, { status: 400 });
    }

    if (action === "approve") {
      // 1. payment_request 조회
      const prRes = await fetch(
        `${SUPABASE_URL}/rest/v1/payment_requests?id=eq.${id}&select=*`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      const [pr] = await prRes.json();
      if (!pr) return NextResponse.json({ error: "not found" }, { status: 404 });
      if (pr.status !== "pending") return NextResponse.json({ error: "이미 처리됨" }, { status: 400 });

      // 2. subscription_until 연장
      const shopRes = await fetch(
        `${SUPABASE_URL}/rest/v1/shops?id=eq.${pr.shop_id}&select=subscription_until`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      const [shop] = await shopRes.json();

      const now = new Date();
      const currentEnd = shop?.subscription_until ? new Date(shop.subscription_until) : now;
      const base = currentEnd > now ? currentEnd : now;
      const months = pr.plan === "yearly" ? 12 : 1;
      const newEnd = new Date(base);
      newEnd.setMonth(newEnd.getMonth() + months);

      // 3. shops 업데이트
      await fetch(`${SUPABASE_URL}/rest/v1/shops?id=eq.${pr.shop_id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription_until: newEnd.toISOString() }),
      });

      // 4. payment_request 상태 업데이트
      await fetch(`${SUPABASE_URL}/rest/v1/payment_requests?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved", reviewed_at: new Date().toISOString() }),
      });

      return NextResponse.json({
        ok: true,
        shop_id: pr.shop_id,
        new_subscription_until: newEnd.toISOString(),
      });
    }

    if (action === "reject") {
      await fetch(`${SUPABASE_URL}/rest/v1/payment_requests?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected", reviewed_at: new Date().toISOString() }),
      });

      return NextResponse.json({ ok: true, status: "rejected" });
    }

    return NextResponse.json({ error: "action은 approve 또는 reject" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

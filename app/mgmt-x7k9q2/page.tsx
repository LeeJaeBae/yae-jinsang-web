"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient, Session } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jwxwjgcbarbfigucarod.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eHdqZ2NiYXJiZmlndWNhcm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjUyNTgsImV4cCI6MjA4NzQ0MTI1OH0.YtAbcj3j2AMTgV_iwi9ZgII8x0py0JTShsh0qX-FBGs"
);

// 관리자 이메일 화이트리스트
const ADMIN_EMAILS = ["nea4182@naver.com", "hello@thebespoke.team"];

interface Shop {
  id: string;
  name: string;
  owner_phone: string;
  referral_code: string;
  is_active: boolean;
  subscription_until: string | null;
  created_at: string;
  _referral_count?: number;
  _tag_count?: number;
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, tags: 0 });
  const [search, setSearch] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  // 세션 체크
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  // 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
    setAuthLoading(false);
  };

  // 데이터 로드
  const loadData = useCallback(async () => {
    if (!isAdmin) return;
    setDataLoading(true);

    const { data: shopsData } = await supabase
      .from("shops")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: tagsData } = await supabase.from("tags").select("shop_id");
    const { data: referralsData } = await supabase.from("referrals").select("referrer_shop_id");

    const now = new Date();
    const enriched = (shopsData || []).map((shop: Shop) => ({
      ...shop,
      _tag_count: (tagsData || []).filter((t: { shop_id: string }) => t.shop_id === shop.id).length,
      _referral_count: (referralsData || []).filter((r: { referrer_shop_id: string }) => r.referrer_shop_id === shop.id).length,
    }));

    setShops(enriched);
    setStats({
      total: enriched.length,
      active: enriched.filter((s: Shop) => s.subscription_until && new Date(s.subscription_until) > now).length,
      expired: enriched.filter((s: Shop) => !s.subscription_until || new Date(s.subscription_until) <= now).length,
      tags: (tagsData || []).length,
    });
    setDataLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, loadData]);

  const showAction = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const extendSubscription = async (shopId: string, months: number) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop) return;

    const base =
      shop.subscription_until && new Date(shop.subscription_until) > new Date()
        ? new Date(shop.subscription_until)
        : new Date();

    base.setMonth(base.getMonth() + months);

    await supabase
      .from("shops")
      .update({ subscription_until: base.toISOString(), is_active: true })
      .eq("id", shopId);

    showAction(`✅ ${shop.name} — ${months}개월 연장 완료`);
    loadData();
  };

  const toggleActive = async (shopId: string, active: boolean) => {
    const shop = shops.find((s) => s.id === shopId);
    await supabase.from("shops").update({ is_active: active }).eq("id", shopId);
    showAction(`${active ? "✅ 활성화" : "🚫 정지"}: ${shop?.name}`);
    loadData();
  };

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.owner_phone.includes(search) ||
      (s.referral_code || "").toLowerCase().includes(search.toLowerCase())
  );

  // 로딩
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF3B30] border-t-transparent rounded-full" />
      </main>
    );
  }

  // 로그인 폼
  if (!session || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="w-full max-w-sm px-6">
          <div className="text-center mb-8">
            <p className="text-4xl mb-3">🔐</p>
            <h1 className="text-2xl font-black">관리자 로그인</h1>
            {session && !isAdmin && (
              <p className="text-red-400 text-sm mt-2">관리자 권한이 없는 계정입니다</p>
            )}
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF3B30]/40"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF3B30]/40"
            />
            {authError && (
              <p className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">{authError}</p>
            )}
            <button
              disabled={authLoading}
              className="w-full bg-[#FF3B30] hover:bg-[#FF3B30]/80 disabled:bg-[#FF3B30]/30 text-white font-bold py-3 rounded-xl transition"
            >
              {authLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 관리자 대시보드
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">🚨 얘진상 관리자</h1>
            <p className="text-white/30 text-sm mt-1">
              {session.user.email} · 업소 관리 · 구독 관리
            </p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-white/30 hover:text-white/60 text-sm bg-white/5 px-4 py-2 rounded-lg transition"
          >
            로그아웃
          </button>
        </div>

        {/* Action message */}
        {actionMsg && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400 text-sm font-medium">
            {actionMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "전체 업소", value: stats.total, color: "white" },
            { label: "활성 구독", value: stats.active, color: "#34C759" },
            { label: "만료/미결제", value: stats.expired, color: "#FF3B30" },
            { label: "총 태그 수", value: stats.tags, color: "#FF9500" },
          ].map((s, i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/5">
              <p className="text-white/40 text-xs mb-1">{s.label}</p>
              <p className="text-3xl font-black" style={{ color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Refresh */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="업소명, 번호, 추천코드 검색..."
            className="flex-1 bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF3B30]/40"
          />
          <button
            onClick={loadData}
            disabled={dataLoading}
            className="bg-[#252525] hover:bg-[#333] px-5 rounded-xl text-sm transition"
          >
            {dataLoading ? "⏳" : "🔄"}
          </button>
        </div>

        {/* Shop List */}
        <div className="space-y-3">
          {filteredShops.map((shop) => {
            const isActive =
              shop.subscription_until && new Date(shop.subscription_until) > new Date();
            const daysLeft = shop.subscription_until
              ? Math.ceil(
                  (new Date(shop.subscription_until).getTime() - Date.now()) / 86400000
                )
              : 0;

            return (
              <div key={shop.id} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg truncate">{shop.name}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {isActive ? `활성 (${daysLeft}일)` : "만료"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                      <span>📞 {shop.owner_phone}</span>
                      <span>🏷️ {shop.referral_code}</span>
                      <span>📋 태그 {shop._tag_count}개</span>
                      <span>🎁 추천 {shop._referral_count}건</span>
                      <span>
                        📅 가입 {new Date(shop.created_at).toLocaleDateString("ko")}
                      </span>
                      {shop.subscription_until && (
                        <span>
                          ⏰ 만료{" "}
                          {new Date(shop.subscription_until).toLocaleDateString("ko")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => extendSubscription(shop.id, 1)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-semibold px-3 py-2 rounded-lg transition"
                    >
                      +1개월
                    </button>
                    <button
                      onClick={() => extendSubscription(shop.id, 12)}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-2 rounded-lg transition"
                    >
                      +1년
                    </button>
                    <button
                      onClick={() => toggleActive(shop.id, !shop.is_active)}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg transition ${
                        shop.is_active
                          ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                          : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                      }`}
                    >
                      {shop.is_active ? "정지" : "활성화"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredShops.length === 0 && (
            <div className="text-center py-20 text-white/20">
              {search ? "검색 결과 없음" : "등록된 업소가 없습니다"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

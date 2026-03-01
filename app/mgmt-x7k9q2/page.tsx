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
  const [tab, setTab] = useState<"shops" | "notices" | "payments" | "promos">("shops");

  // 계정 생성 폼
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLoginId, setNewLoginId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [creating, setCreating] = useState(false);

  // 입금 요청
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // 프로모 코드
  const [promos, setPromos] = useState<any[]>([]);
  const [promosLoading, setPromosLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDays, setPromoDays] = useState(14);
  const [promoMaxUses, setPromoMaxUses] = useState(100);
  const [promoDesc, setPromoDesc] = useState("");
  const [creatingPromo, setCreatingPromo] = useState(false);

  // 공지사항
  interface Notice {
    id: string;
    title: string;
    content: string;
    category: string;
    is_pinned: boolean;
    created_at: string;
  }
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeCategory, setNoticeCategory] = useState("공지");
  const [noticePinned, setNoticePinned] = useState(false);
  const [editingNotice, setEditingNotice] = useState<string | null>(null);

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
      active: enriched.filter((s: Shop) => s.is_active && s.subscription_until && new Date(s.subscription_until) > now).length,
      expired: enriched.filter((s: Shop) => !s.is_active || !s.subscription_until || new Date(s.subscription_until) <= now).length,
      tags: (tagsData || []).length,
    });
    setDataLoading(false);
  }, [isAdmin]);

  const loadNotices = useCallback(async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    setNotices((data || []) as Notice[]);
  }, []);

  const loadPayments = useCallback(async () => {
    setPaymentsLoading(true);
    const { data } = await supabase
      .from("payment_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setPayments(data || []);
    setPaymentsLoading(false);
  }, []);

  const loadPromos = useCallback(async () => {
    setPromosLoading(true);
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setPromos(data || []);
    setPromosLoading(false);
  }, []);

  const handleCreatePromo = async () => {
    if (!promoCode) { showAction("❌ 코드를 입력하세요"); return; }
    setCreatingPromo(true);
    const { error } = await supabase.from("promo_codes").insert({
      code: promoCode.toUpperCase(),
      days_to_add: promoDays,
      max_uses: promoMaxUses,
      description: promoDesc || null,
      is_active: true,
    });
    if (error) {
      showAction(`❌ 생성 실패: ${error.message}`);
    } else {
      showAction(`✅ 프로모 코드 생성: ${promoCode.toUpperCase()}`);
      setPromoCode(""); setPromoDays(14); setPromoMaxUses(100); setPromoDesc("");
      loadPromos();
    }
    setCreatingPromo(false);
  };

  const togglePromoActive = async (id: string, active: boolean) => {
    await supabase.from("promo_codes").update({ is_active: !active }).eq("id", id);
    loadPromos();
  };

  const handleCreateAccount = async () => {
    if (!newName || !newLoginId || !newPassword) {
      showAction("❌ 업소명, 아이디, 비밀번호는 필수입니다");
      return;
    }
    setCreating(true);
    try {
      const encoder = new TextEncoder();
      const hashBuf = await crypto.subtle.digest("SHA-256", encoder.encode(newPassword));
      const pwHash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");

      const { error } = await supabase.from("shops").insert({
        id: crypto.randomUUID(),
        name: newName,
        login_id: newLoginId,
        password_hash: pwHash,
        owner_phone: newPhone || null,
        region: newRegion || null,
        category: newCategory || null,
        is_active: true,
        subscription_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (error) {
        showAction(`❌ 생성 실패: ${error.message}`);
      } else {
        showAction(`✅ 계정 생성 완료! 아이디: ${newLoginId} / 비밀번호: ${newPassword}`);
        setNewName(""); setNewPhone(""); setNewLoginId(""); setNewPassword("");
        setNewRegion(""); setNewCategory("");
        loadData();
      }
    } catch (e: any) {
      showAction(`❌ 오류: ${e.message}`);
    }
    setCreating(false);
  };

  const handlePaymentAction = async (id: string, action: "approve" | "reject") => {
    try {
      await fetch("/api/payment-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, secret: "jinsang-admin-2024" }),
      });
      showAction(action === "approve" ? "✅ 입금 승인 완료" : "❌ 입금 거절 완료");
      loadPayments();
      loadData();
    } catch (e: any) {
      showAction(`❌ 처리 실패: ${e.message}`);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
      loadNotices();
      loadPayments();
      loadPromos();
    }
  }, [isAdmin, loadData, loadNotices, loadPayments, loadPromos]);

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

  const saveNotice = async () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      showAction("❌ 제목과 내용을 입력하세요");
      return;
    }

    if (editingNotice) {
      await supabase.from("notices").update({
        title: noticeTitle,
        content: noticeContent,
        category: noticeCategory,
        is_pinned: noticePinned,
      }).eq("id", editingNotice);
      showAction("✅ 공지 수정 완료");
    } else {
      await supabase.from("notices").insert({
        title: noticeTitle,
        content: noticeContent,
        category: noticeCategory,
        is_pinned: noticePinned,
      });
      showAction("✅ 공지 등록 완료");
    }

    setNoticeTitle("");
    setNoticeContent("");
    setNoticeCategory("공지");
    setNoticePinned(false);
    setEditingNotice(null);
    loadNotices();
  };

  const editNotice = (notice: Notice) => {
    setEditingNotice(notice.id);
    setNoticeTitle(notice.title);
    setNoticeContent(notice.content);
    setNoticeCategory(notice.category);
    setNoticePinned(notice.is_pinned);
  };

  const deleteNotice = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from("notices").delete().eq("id", id);
    showAction("🗑️ 공지 삭제 완료");
    loadNotices();
  };

  const togglePin = async (id: string, pinned: boolean) => {
    await supabase.from("notices").update({ is_pinned: !pinned }).eq("id", id);
    loadNotices();
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["shops", "notices", "payments", "promos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                tab === t
                  ? "bg-[#FF3B30] text-white"
                  : "bg-[#1A1A1A] text-white/40 hover:text-white/60"
              }`}
            >
              {t === "shops" ? `🏪 업소 (${stats.total})` : t === "notices" ? `📢 공지 (${notices.length})` : t === "payments" ? `💰 입금 (${payments.filter(p => p.status === "pending").length})` : `🎁 프로모 (${promos.length})`}
            </button>
          ))}
        </div>

        {tab === "notices" && (
          <div className="space-y-6 mb-8">
            {/* 공지 작성 */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">
                {editingNotice ? "✏️ 공지 수정" : "📝 새 공지 작성"}
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  >
                    <option value="공지">📢 공지</option>
                    <option value="업데이트">🆕 업데이트</option>
                    <option value="이벤트">🎉 이벤트</option>
                    <option value="점검">🔧 점검</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noticePinned}
                      onChange={(e) => setNoticePinned(e.target.checked)}
                      className="accent-[#FF3B30]"
                    />
                    📌 고정
                  </label>
                </div>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="제목"
                  className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF3B30]/40"
                />
                <textarea
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="내용"
                  rows={4}
                  className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF3B30]/40 resize-y"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveNotice}
                    className="bg-[#FF3B30] hover:bg-[#FF3B30]/80 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
                  >
                    {editingNotice ? "수정 완료" : "등록"}
                  </button>
                  {editingNotice && (
                    <button
                      onClick={() => {
                        setEditingNotice(null);
                        setNoticeTitle("");
                        setNoticeContent("");
                        setNoticeCategory("공지");
                        setNoticePinned(false);
                      }}
                      className="bg-[#252525] hover:bg-[#333] text-white/50 px-6 py-2.5 rounded-xl text-sm transition"
                    >
                      취소
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 공지 목록 */}
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`bg-[#1A1A1A] border rounded-2xl p-5 ${
                    notice.is_pinned ? "border-[#FF3B30]/30" : "border-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          {notice.category === "공지" ? "📢" : notice.category === "업데이트" ? "🆕" : notice.category === "이벤트" ? "🎉" : "🔧"} {notice.category}
                        </span>
                        {notice.is_pinned && <span className="text-xs">📌</span>}
                        <span className="text-xs text-white/20">
                          {new Date(notice.created_at).toLocaleDateString("ko")}
                        </span>
                      </div>
                      <h4 className="font-bold truncate">{notice.title}</h4>
                      <p className="text-sm text-white/40 line-clamp-2 mt-1">{notice.content}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => togglePin(notice.id, notice.is_pinned)}
                        className="text-xs bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition"
                        title={notice.is_pinned ? "고정 해제" : "고정"}
                      >
                        {notice.is_pinned ? "📌" : "📍"}
                      </button>
                      <button
                        onClick={() => editNotice(notice)}
                        className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded-lg transition"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteNotice(notice.id)}
                        className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg transition"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {notices.length === 0 && (
                <div className="text-center py-20 text-white/20">등록된 공지가 없습니다</div>
              )}
            </div>
          </div>
        )}

        {/* 입금 요청 탭 */}
        {tab === "payments" && (
          <div className="space-y-3 mb-8">
            {paymentsLoading ? (
              <p className="text-white/40">로딩 중...</p>
            ) : payments.length === 0 ? (
              <div className="text-center py-20 text-white/20">입금 요청이 없습니다</div>
            ) : (
              payments.map((r) => (
                <div key={r.id} className={`bg-[#1A1A1A] rounded-2xl p-5 border ${
                  r.status === "pending" ? "border-orange-500/30" : r.status === "approved" ? "border-green-500/20" : "border-red-500/20"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg">{r.depositor_name || "미입력"}</span>
                      <span className="text-orange-400 ml-3 font-bold">{Number(r.amount).toLocaleString()}원</span>
                      <span className="text-white/30 text-sm ml-2">{r.plan === "yearly" ? "연간" : "월간"}</span>
                      <span className={`text-xs ml-3 px-2 py-0.5 rounded-full ${
                        r.status === "pending" ? "bg-orange-500/20 text-orange-400" :
                        r.status === "approved" ? "bg-green-500/20 text-green-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {r.status === "pending" ? "대기" : r.status === "approved" ? "승인" : "거절"}
                      </span>
                      <p className="text-xs text-white/30 mt-1">
                        {new Date(r.created_at).toLocaleString("ko-KR")} · <span className="text-[10px]">{r.shop_id}</span>
                      </p>
                    </div>
                    {r.status === "pending" && (
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => handlePaymentAction(r.id, "approve")}
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">
                          ✅ 승인
                        </button>
                        <button onClick={() => handlePaymentAction(r.id, "reject")}
                          className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-lg transition">
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 프로모 코드 탭 */}
        {tab === "promos" && (
          <div className="space-y-6 mb-8">
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">➕ 새 프로모 코드</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="코드 (예: FREE2W)" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                  className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/40 uppercase" />
                <input placeholder="설명" value={promoDesc} onChange={e => setPromoDesc(e.target.value)}
                  className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/40" />
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-sm shrink-0">무료 기간</span>
                  <input type="number" value={promoDays} onChange={e => setPromoDays(Number(e.target.value))}
                    className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none w-24" />
                  <span className="text-white/40 text-sm">일</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-sm shrink-0">최대 사용</span>
                  <input type="number" value={promoMaxUses} onChange={e => setPromoMaxUses(Number(e.target.value))}
                    className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none w-24" />
                  <span className="text-white/40 text-sm">회</span>
                </div>
              </div>
              <button onClick={handleCreatePromo} disabled={creatingPromo}
                className="mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
                {creatingPromo ? "생성 중..." : "코드 생성"}
              </button>
            </div>

            <div className="space-y-3">
              {promosLoading ? (
                <p className="text-white/40">로딩 중...</p>
              ) : promos.length === 0 ? (
                <div className="text-center py-20 text-white/20">프로모 코드가 없습니다</div>
              ) : (
                promos.map((p) => (
                  <div key={p.id} className={`bg-[#1A1A1A] rounded-2xl p-5 border ${p.is_active ? "border-green-500/20" : "border-white/5 opacity-50"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-lg text-green-400">{p.code}</span>
                        <span className={`text-xs ml-3 px-2 py-0.5 rounded-full ${p.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {p.is_active ? "활성" : "비활성"}
                        </span>
                        <p className="text-sm text-white/40 mt-1">
                          {p.days_to_add}일 무료 · {p.used_count}/{p.max_uses}회 사용 · {p.description || "설명 없음"}
                        </p>
                        <p className="text-xs text-white/20 mt-0.5">
                          {new Date(p.created_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                      <button onClick={() => togglePromoActive(p.id, p.is_active)}
                        className={`text-xs px-3 py-2 rounded-lg transition ${
                          p.is_active ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                        }`}>
                        {p.is_active ? "비활성화" : "활성화"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Search + Refresh */}
        {tab === "shops" && <>
        {/* 계정 생성 */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6 border border-white/5">
          <h3 className="font-bold text-lg mb-4">➕ 새 계정 생성</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="업소명 *" value={newName} onChange={e => setNewName(e.target.value)}
              className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/40" />
            <input placeholder="아이디 *" value={newLoginId} onChange={e => setNewLoginId(e.target.value)}
              className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/40" />
            <input placeholder="비밀번호 *" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/40" />
            <input placeholder="전화번호" value={newPhone} onChange={e => setNewPhone(e.target.value)}
              className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/40" />
            <select value={newRegion} onChange={e => setNewRegion(e.target.value)}
              className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none">
              <option value="">지역</option>
              {["서울","부산","대구","인천","광주","대전","울산","세종","경기","강원","충북","충남","전북","전남","경북","경남","제주"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
              className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none">
              <option value="">업종</option>
              {["노래방","클럽","바","라운지","룸살롱","가라오케","마사지","스파","기타"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={handleCreateAccount} disabled={creating}
            className="mt-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
            {creating ? "생성 중..." : "계정 생성"}
          </button>
        </div>

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
              shop.is_active && shop.subscription_until && new Date(shop.subscription_until) > new Date();
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
        </div></>}
      </div>
    </main>
  );
}

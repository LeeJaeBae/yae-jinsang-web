"use client";

import { useState, useEffect, useCallback } from "react";
import { createHash } from "crypto";

const ADMIN_SECRET = "jinsang-admin-2024";
const SUPABASE_URL = "https://jwxwjgcbarbfigucarod.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eHdqZ2NiYXJiZmlndWNhcm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjUyNTgsImV4cCI6MjA4NzQ0MTI1OH0.YtAbcj3j2AMTgV_iwi9ZgII8x0py0JTShsh0qX-FBGs";

interface Shop {
  id: string;
  name: string;
  login_id: string | null;
  owner_phone: string | null;
  region: string | null;
  category: string | null;
  is_active: boolean;
  subscription_until: string | null;
  created_at: string;
}

function sha256(text: string) {
  // browser-compatible sha256
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(text)).then((buf) => {
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);

  // 새 계정 생성 폼
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLoginId, setNewLoginId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");

  // 구독 연장
  const [extendId, setExtendId] = useState("");
  const [extendMonths, setExtendMonths] = useState(1);
  const [extending, setExtending] = useState(false);

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  const loadShops = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/shops?select=*&order=created_at.desc`,
      { headers }
    );
    const data = await res.json();
    if (Array.isArray(data)) setShops(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadShops();
  }, [authed, loadShops]);

  const handleLogin = () => {
    if (secret === ADMIN_SECRET) {
      setAuthed(true);
    } else {
      alert("비밀번호가 틀렸습니다");
    }
  };

  const handleCreate = async () => {
    if (!newName || !newLoginId || !newPassword) {
      setMsg("❌ 업소명, 아이디, 비밀번호는 필수입니다");
      return;
    }

    setCreating(true);
    setMsg("");

    try {
      const pwHash = await sha256(newPassword);
      const id = crypto.randomUUID();

      const res = await fetch(`${SUPABASE_URL}/rest/v1/shops`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({
          id,
          name: newName,
          login_id: newLoginId,
          password_hash: pwHash,
          owner_phone: newPhone || null,
          region: newRegion || null,
          category: newCategory || null,
          is_active: true,
          subscription_until: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        }),
      });

      if (res.ok) {
        setMsg(`✅ 계정 생성 완료! 아이디: ${newLoginId}`);
        setNewName("");
        setNewPhone("");
        setNewLoginId("");
        setNewPassword("");
        setNewRegion("");
        setNewCategory("");
        loadShops();
      } else {
        const err = await res.json();
        setMsg(`❌ 생성 실패: ${err.message || JSON.stringify(err)}`);
      }
    } catch (e: any) {
      setMsg(`❌ 오류: ${e.message}`);
    }
    setCreating(false);
  };

  const handleExtend = async (shopId: string, months: number) => {
    setExtending(true);
    try {
      // 현재 구독 확인
      const shopRes = await fetch(
        `${SUPABASE_URL}/rest/v1/shops?id=eq.${shopId}&select=subscription_until`,
        { headers }
      );
      const [shop] = await shopRes.json();

      const now = new Date();
      const currentEnd = shop?.subscription_until
        ? new Date(shop.subscription_until)
        : now;
      const base = currentEnd > now ? currentEnd : now;
      const newEnd = new Date(base);
      newEnd.setMonth(newEnd.getMonth() + months);

      await fetch(`${SUPABASE_URL}/rest/v1/shops?id=eq.${shopId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ subscription_until: newEnd.toISOString() }),
      });

      setMsg(`✅ 구독 연장 완료 → ${newEnd.toLocaleDateString("ko-KR")}`);
      loadShops();
    } catch (e: any) {
      setMsg(`❌ 연장 실패: ${e.message}`);
    }
    setExtending(false);
  };

  const handleToggleActive = async (shop: Shop) => {
    await fetch(`${SUPABASE_URL}/rest/v1/shops?id=eq.${shop.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ is_active: !shop.is_active }),
    });
    loadShops();
  };

  const formatDate = (d: string | null) => {
    if (!d) return "-";
    const date = new Date(d);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const isExpired = (d: string | null) => {
    if (!d) return true;
    return new Date(d) < new Date();
  };

  // 로그인 화면
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 w-full max-w-sm border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            🔐 관리자
          </h1>
          <input
            type="password"
            placeholder="관리자 비밀번호"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-[#252525] text-white px-4 py-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">⚙️ 얘진상 관리자</h1>

        {/* 메시지 */}
        {msg && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm ${
              msg.startsWith("✅")
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {msg}
          </div>
        )}

        {/* 새 계정 생성 */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-8 border border-white/5">
          <h2 className="text-xl font-bold mb-4">➕ 새 계정 생성</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="업소명 *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-[#252525] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              placeholder="전화번호"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="bg-[#252525] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              placeholder="아이디 *"
              value={newLoginId}
              onChange={(e) => setNewLoginId(e.target.value)}
              className="bg-[#252525] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              placeholder="비밀번호 *"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-[#252525] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              className="bg-[#252525] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white"
            >
              <option value="">지역 (선택)</option>
              {[
                "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
                "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
              ].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-[#252525] px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white"
            >
              <option value="">업종 (선택)</option>
              {[
                "노래방", "클럽", "바", "라운지", "룸살롱", "가라오케",
                "마사지", "스파", "기타",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="mt-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            {creating ? "생성 중..." : "계정 생성"}
          </button>
        </div>

        {/* 업소 목록 */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              📋 등록 업소 ({shops.length})
            </h2>
            <button
              onClick={loadShops}
              className="text-sm text-white/40 hover:text-white/70 transition"
            >
              🔄 새로고침
            </button>
          </div>

          {loading ? (
            <p className="text-white/40">로딩 중...</p>
          ) : shops.length === 0 ? (
            <p className="text-white/40">등록된 업소가 없습니다</p>
          ) : (
            <div className="space-y-3">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-[#252525] rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{shop.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            shop.is_active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {shop.is_active ? "활성" : "비활성"}
                        </span>
                        {shop.subscription_until && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              isExpired(shop.subscription_until)
                                ? "bg-red-500/20 text-red-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {isExpired(shop.subscription_until)
                              ? "구독만료"
                              : `~${formatDate(shop.subscription_until)}`}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/40 space-y-0.5">
                        <p>
                          아이디: <span className="text-white/60">{shop.login_id || "-"}</span>
                          {" · "}전화: <span className="text-white/60">{shop.owner_phone || "-"}</span>
                        </p>
                        <p>
                          지역: {shop.region || "-"} · 업종: {shop.category || "-"} · 가입: {formatDate(shop.created_at)}
                        </p>
                        <p className="text-[10px] text-white/20">ID: {shop.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <button
                        onClick={() => handleExtend(shop.id, 1)}
                        disabled={extending}
                        className="text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1.5 rounded-lg transition"
                      >
                        +1개월
                      </button>
                      <button
                        onClick={() => handleToggleActive(shop)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition ${
                          shop.is_active
                            ? "bg-red-600/20 hover:bg-red-600/40 text-red-400"
                            : "bg-green-600/20 hover:bg-green-600/40 text-green-400"
                        }`}
                      >
                        {shop.is_active ? "비활성화" : "활성화"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 입금 요청 */}
        <PendingPayments headers={headers} onAction={() => loadShops()} />
      </div>
    </div>
  );
}

function PendingPayments({
  headers,
  onAction,
}: {
  headers: Record<string, string>;
  onAction: () => void;
}) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/payment_requests?select=*&order=created_at.desc&limit=50`,
      { headers }
    );
    const data = await res.json();
    if (Array.isArray(data)) setRequests(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id: string) => {
    await fetch("https://jinsang.thebespoke.team/api/payment-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "approve", secret: ADMIN_SECRET }),
    });
    load();
    onAction();
  };

  const handleReject = async (id: string) => {
    await fetch("https://jinsang.thebespoke.team/api/payment-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "reject", secret: ADMIN_SECRET }),
    });
    load();
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 mt-8 border border-white/5">
      <h2 className="text-xl font-bold mb-4">
        💰 입금 요청 ({requests.filter((r) => r.status === "pending").length}건 대기)
      </h2>
      {loading ? (
        <p className="text-white/40">로딩 중...</p>
      ) : requests.length === 0 ? (
        <p className="text-white/40">입금 요청이 없습니다</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className={`bg-[#252525] rounded-xl p-4 border ${
                r.status === "pending"
                  ? "border-orange-500/30"
                  : r.status === "approved"
                  ? "border-green-500/20"
                  : "border-red-500/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold">
                    {r.depositor_name || "미입력"}
                  </span>
                  <span className="text-orange-400 ml-2 font-bold">
                    {Number(r.amount).toLocaleString()}원
                  </span>
                  <span className="text-white/30 text-sm ml-2">
                    {r.plan === "yearly" ? "연간" : "월간"}
                  </span>
                  <span
                    className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                      r.status === "pending"
                        ? "bg-orange-500/20 text-orange-400"
                        : r.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {r.status === "pending"
                      ? "대기"
                      : r.status === "approved"
                      ? "승인"
                      : "거절"}
                  </span>
                  <p className="text-xs text-white/30 mt-1">
                    {new Date(r.created_at).toLocaleString("ko-KR")}
                    {" · "}
                    <span className="text-[10px]">{r.shop_id}</span>
                  </p>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      ✅ 승인
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg transition"
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

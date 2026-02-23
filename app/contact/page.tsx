"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");
  const [category, setCategory] = useState("일반 문의");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const subject = `[얘진상 ${category}] ${name}${shopName ? ` (${shopName})` : ""}`;
    const body = `이름: ${name}\n이메일: ${email}\n업소명: ${shopName || "미입력"}\n분류: ${category}\n\n${message}`;

    // mailto 링크로 메일 앱 열기
    const mailtoUrl = `mailto:hello@thebespoke.team?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    // 동시에 formsubmit.co로도 전송 (백업)
    try {
      await fetch("https://formsubmit.co/ajax/hello@thebespoke.team", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          shopName,
          category,
          message,
          _subject: subject,
        }),
      });
    } catch {
      // formsubmit 실패해도 mailto는 열렸으니 OK
    }

    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-6xl mb-6">✉️</p>
          <h1 className="text-3xl font-black mb-4">문의가 접수되었습니다</h1>
          <p className="text-white/50 mb-2">메일 앱이 열리지 않았다면 아래 주소로 직접 보내주세요.</p>
          <a href="mailto:hello@thebespoke.team" className="text-brand-red-light hover:underline text-lg">
            hello@thebespoke.team
          </a>
          <div className="mt-8">
            <a href="/" className="text-white/40 hover:text-white/60 text-sm">← 홈으로 돌아가기</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <div className="max-w-xl mx-auto px-6 py-24">
        <a href="/" className="text-brand-red-light text-sm hover:underline">← 홈으로</a>
        <h1 className="text-4xl font-black mt-6 mb-2">문의하기</h1>
        <p className="text-white/40 mb-12">궁금한 점이 있으시면 편하게 문의해 주세요.<br />영업일 기준 24시간 내 답변드립니다.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/50 mb-1.5 block">이름 *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-input border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red/40 transition"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1.5 block">이메일 *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-input border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red/40 transition"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-1.5 block">업소명 (선택)</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-brand-input border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red/40 transition"
              placeholder="업소명을 입력하세요"
            />
          </div>

          <div>
            <label className="text-sm text-white/50 mb-1.5 block">분류 *</label>
            <div className="flex flex-wrap gap-2">
              {["일반 문의", "구독/결제", "기능 제안", "버그 신고", "제휴 문의"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    category === cat
                      ? "bg-brand-red text-white"
                      : "bg-brand-input border border-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-1.5 block">문의 내용 *</label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-brand-input border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red/40 transition resize-none"
              placeholder="문의 내용을 자세히 적어주세요"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-brand-red/80 disabled:bg-brand-red/30 text-white font-bold text-base py-4 rounded-xl transition"
          >
            {loading ? "전송 중..." : "문의 보내기"}
          </button>

          <p className="text-center text-white/20 text-xs">
            문의는 hello@thebespoke.team 으로 전송됩니다
          </p>
        </form>
      </div>
    </main>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const features = [
  {
    emoji: "📞",
    title: "전화 오면 바로 확인",
    desc: "예약 전화가 올 때 자동으로 진상 여부를 체크합니다. 받기 전에 미리 대비하세요.",
  },
  {
    emoji: "🚨",
    title: "실시간 경고",
    desc: "진상으로 등록된 번호면 화면에 빨간 경고가 뜹니다. 아이들한테 미리 알려줄 수 있어요.",
  },
  {
    emoji: "🔗",
    title: "업소끼리 공유",
    desc: "한 곳에서 당하면 다른 업소에서도 알 수 있습니다. 같은 진상에 두 번 당할 필요 없어요.",
  },
  {
    emoji: "🔒",
    title: "번호 유출 걱정 없음",
    desc: "전화번호는 암호화 처리됩니다. 고객 정보가 밖으로 새어나갈 일 없어요.",
  },
  {
    emoji: "📋",
    title: "연락처에서 바로 등록",
    desc: "이미 저장해둔 블랙 연락처? 한번에 불러와서 등록하세요. 메모도 자동 인식.",
  },
  {
    emoji: "📊",
    title: "태그로 유형 파악",
    desc: "폭력, 먹튀, 행패, 스토커 등 태그로 분류. 어떤 유형인지 한눈에 보입니다.",
  },
];

const steps = [
  { num: "01", title: "앱 설치", desc: "APK 다운로드 후 설치 (안드로이드)" },
  { num: "02", title: "권한 허용", desc: "전화 스크리닝 + 화면 오버레이" },
  { num: "03", title: "진상 등록", desc: "번호 + 태그로 블랙리스트 등록" },
  { num: "04", title: "자동 감지", desc: "전화 오면 즉시 경고!" },
];

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");

  const faqs = [
    {
      q: "전화번호가 다른 업소에 유출되나요?",
      a: "절대 아닙니다. 전화번호는 SHA-256 해시로 변환되어 저장됩니다. 원본 번호는 서버에 올라가지 않으며, 다른 업소에서는 '주의 등록 N건' 같은 태그 정보만 확인할 수 있습니다.",
    },
    {
      q: "진상 전화를 자동으로 차단하나요?",
      a: "아닙니다. 얘진상은 전화를 차단하지 않고 경고만 합니다. 받을지 말지는 사장님이 직접 판단하세요. 불필요한 분쟁을 방지합니다.",
    },
    {
      q: "iOS(아이폰)에서도 사용할 수 있나요?",
      a: "현재는 안드로이드 전용입니다. iOS는 전화 스크리닝 API 제한으로 동일한 기능을 구현하기 어렵습니다.",
    },
    {
      q: "어떤 업종에서 사용할 수 있나요?",
      a: "모든 업종에서 사용 가능합니다. 유흥, 식당, 배달, 숙박, 서비스업 등 전화를 받는 모든 사업장에 적합합니다.",
    },
    {
      q: "구독을 취소하면 등록한 데이터는 어떻게 되나요?",
      a: "데이터는 유지됩니다. 재구독하면 기존 데이터를 그대로 사용할 수 있습니다.",
    },
  ];

  return (
    <main className="overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-brand-dark/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="얘진상" className="w-8 h-8" />
            <span className="text-lg font-bold">얘진상</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition">기능</a>
            <a href="/guide" className="hover:text-white transition">사용법</a>
            <a href="#pricing" className="hover:text-white transition">가격</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <a
            href="#download"
            className="bg-brand-red hover:bg-brand-red/80 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            다운로드
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
              <span className="text-brand-red-light text-sm font-medium">
                진상 차단 시스템
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
              떠나간 에이스는
              <br />
              <span className="text-brand-red">돌아오지 않습니다.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              사슴같은 우리 아이들을 지켜주세요.
              <br />
              진상 손님, 전화 받기 전에 미리 알 수 있습니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#download"
                className="bg-brand-red hover:bg-brand-red/80 text-white font-bold text-lg px-8 py-4 rounded-2xl transition animate-pulse-glow"
              >
                지금 시작하기
              </a>
              <a
                href="#features"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition"
              >
                더 알아보기
              </a>
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20"
          >
            <div className="animate-float mx-auto w-[280px] h-[560px] bg-brand-card rounded-[3rem] border border-white/10 p-3 shadow-2xl shadow-brand-red/10">
              <div className="w-full h-full bg-brand-dark rounded-[2.4rem] overflow-hidden flex flex-col">
                {/* Status bar */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-20 h-5 bg-white/10 rounded-full" />
                </div>
                {/* Warning overlay preview */}
                <div className="mx-3 mt-2 bg-brand-red/15 border border-brand-red/30 rounded-2xl p-4">
                  <p className="text-brand-red font-bold text-lg text-center">
                    🚨 얘진상 경고
                  </p>
                  <p className="text-white/70 text-sm text-center mt-1">
                    ****-**-1234
                  </p>
                  <p className="text-brand-red-light text-sm text-center mt-2">
                    ⚠️ 3개 업소에서 주의 등록
                  </p>
                  <p className="text-white/40 text-xs text-center mt-1">
                    폭력 2건, 먹튀 1건
                  </p>
                </div>
                {/* Tag chips */}
                <div className="flex flex-wrap gap-2 mx-3 mt-4 px-1">
                  {["👊 폭력", "💸 먹튀", "🤬 행패", "⛔ 블랙"].map((t) => (
                    <span
                      key={t}
                      className="bg-white/5 border border-white/10 text-xs text-white/60 rounded-full px-3 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {/* Fake list items */}
                <div className="flex-1 mx-3 mt-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-brand-card rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="text-lg">
                        {["👊", "💸", "🤬"][i - 1]}
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/10 rounded w-24" />
                        <div className="h-2 bg-white/5 rounded w-16 mt-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-brand-red font-semibold mb-3">
              FEATURES
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black">
              사장님이 지켜야 할 것
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group bg-brand-card hover:bg-brand-card/80 border border-white/5 hover:border-brand-red/20 rounded-2xl p-7 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{f.emoji}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-32 bg-brand-card/30">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-brand-red font-semibold mb-3">
              HOW IT WORKS
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black">
              4단계면 끝
            </motion.h2>
          </motion.div>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-6 bg-brand-card border border-white/5 rounded-2xl p-6"
              >
                <span className="text-4xl font-black text-brand-red/30 shrink-0 w-16 text-center">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="text-white/40 text-sm mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32">
        <div className="max-w-lg mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-brand-red font-semibold mb-3">
              PRICING
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black">
              합리적인 요금제
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-red/20 rounded-3xl blur-xl pointer-events-none" />
            {/* 가격 토글 */}
            <div className="relative z-10 flex items-center justify-center gap-3 mb-8">
              <button
                onClick={() => setPlan("monthly")}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                  plan === "monthly"
                    ? "bg-brand-red text-white"
                    : "bg-white/5 text-white/40 hover:text-white/60"
                }`}
              >
                월간
              </button>
              <button
                onClick={() => setPlan("yearly")}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                  plan === "yearly"
                    ? "bg-brand-red text-white"
                    : "bg-white/5 text-white/40 hover:text-white/60"
                }`}
              >
                연간
                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  10% 할인
                </span>
              </button>
            </div>

            <div className="relative z-10 bg-brand-card border border-brand-red/20 rounded-3xl p-10 text-center">
              <p className="text-white/50 text-sm font-medium mb-2">
                {plan === "monthly" ? "월 구독" : "연 구독"}
              </p>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-6xl font-black">
                  {plan === "monthly" ? "49,000" : "529,200"}
                </span>
                <span className="text-white/50 text-lg mb-2">
                  {plan === "monthly" ? "원/월" : "원/년"}
                </span>
              </div>
              {plan === "yearly" && (
                <div className="mb-6">
                  <span className="text-white/30 text-sm line-through mr-2">588,000원</span>
                  <span className="text-green-400 text-sm font-semibold">58,800원 절약</span>
                </div>
              )}
              {plan === "monthly" && <div className="mb-6" />}

              <div className="space-y-4 text-left mb-10">
                {[
                  "수신 전화 실시간 진상 감지",
                  "진상 태그 무제한 등록",
                  "업소간 블랙리스트 공유",
                  "연락처 일괄 불러오기",
                  "월간 차단 리포트",
                  "우선 고객지원",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-brand-red">✓</span>
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="#download"
                className="block w-full bg-brand-red hover:bg-brand-red/80 text-white font-bold text-lg py-4 rounded-2xl transition"
              >
                시작하기
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 bg-brand-card/30">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-brand-red font-semibold mb-3">
              FAQ
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black">
              자주 묻는 질문
            </motion.h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full bg-brand-card border border-white/5 rounded-2xl p-6 text-left transition hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold pr-4">{faq.q}</h3>
                    <span
                      className={`text-white/30 text-xl transition-transform ${
                        faqOpen === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>
                  {faqOpen === i && (
                    <p className="text-white/40 text-sm mt-4 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-brand-red font-semibold mb-3">
              REFERRAL
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black">
              추천하면 무료
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-5"
          >
            <div className="bg-brand-card border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">🎁</p>
              <h3 className="text-lg font-bold mb-2">추천한 나</h3>
              <p className="text-brand-red text-2xl font-black mb-1">1개월 무료</p>
              <p className="text-white/40 text-sm">추천 1건당 구독 1개월 연장</p>
            </div>
            <div className="bg-brand-card border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">🎉</p>
              <h3 className="text-lg font-bold mb-2">추천받은 상대</h3>
              <p className="text-green-400 text-2xl font-black mb-1">첫 달 50% 할인</p>
              <p className="text-white/40 text-sm">24,500원으로 시작</p>
            </div>
            <div className="bg-brand-card border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">♾️</p>
              <h3 className="text-lg font-bold mb-2">제한 없음</h3>
              <p className="text-white text-2xl font-black mb-1">무한 추천</p>
              <p className="text-white/40 text-sm">10명 추천 = 10개월 무료!</p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/30 text-sm mt-8"
          >
            가입 후 앱에서 내 추천코드를 확인하고 공유하세요
          </motion.p>
        </div>
      </section>

      {/* CTA / Download */}
      <section id="download" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-red/5 to-transparent" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-6xl mb-6">🛡️</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              우리 아이들은
              <br />
              내가 지킨다.
            </h2>
            <p className="text-white/50 text-lg mb-10">
              한 번의 설치로 업소 전체를 보호하세요.
              <br />
              진상은 걸러내고, 에이스는 지켜내고.
            </p>
            <a
              href="https://github.com/LeeJaeBae/yae-jinsang/releases/latest/download/app-release.apk"
              className="inline-flex items-center gap-3 bg-brand-red hover:bg-brand-red/80 text-white font-bold text-lg px-10 py-5 rounded-2xl transition animate-pulse-glow"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.523 2.246a.75.75 0 0 0-1.046 0L14.5 4.223 13.024 2.746a.75.75 0 1 0-1.048 1.072l1.3 1.27A7.5 7.5 0 0 0 4.5 12v.75h15V12a7.5 7.5 0 0 0-8.776-7.412l1.3-1.27a.75.75 0 0 0-.001-1.072ZM4.5 14.25v4.5A3.25 3.25 0 0 0 7.75 22h8.5a3.25 3.25 0 0 0 3.25-3.25v-4.5h-15Z" />
              </svg>
              Android APK 다운로드
            </a>
            <p className="text-white/30 text-sm mt-4">
              안드로이드 10 이상 · 51MB
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="얘진상" className="w-5 h-5" />
            <span className="font-bold">얘진상</span>
            <span className="text-white/30 text-sm ml-2">
              © 2026 더 비스포크
            </span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="/terms" className="hover:text-white/60 transition">
              이용약관
            </a>
            <a href="/privacy" className="hover:text-white/60 transition">
              개인정보처리방침
            </a>
            <a href="/contact" className="hover:text-white/60 transition">
              문의하기
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

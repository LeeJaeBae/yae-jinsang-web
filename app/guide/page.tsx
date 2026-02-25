"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const sections = [
  {
    title: "1. 앱 설치 & 시작",
    desc: "APK를 다운받아 설치하면 온보딩 화면이 나타납니다. 4페이지로 서비스를 소개하고, 바로 시작할 수 있어요.",
    images: [
      { src: "/guide/01_onboarding1.png", caption: "환영 화면" },
      { src: "/guide/02_onboarding2.png", caption: "자동 감지 소개" },
      { src: "/guide/03_onboarding3.png", caption: "연락처 등록" },
      { src: "/guide/04_onboarding4.png", caption: "함께 보호" },
    ],
  },
  {
    title: "2. 진상 등록하기",
    desc: "전화번호를 입력하고 태그(폭력, 먹튀, 행패, 스토커, 블랙)를 선택한 후 등록하세요. 다른 업소에서도 이 정보를 볼 수 있습니다.",
    images: [
      { src: "/guide/10_home.png", caption: "홈 화면 — 번호 입력 & 태그 선택" },
    ],
  },
  {
    title: "3. 전화 수신 시 자동 감지",
    desc: "전화가 오면 자동으로 진상 여부를 조회합니다. 진상이면 빨간 경고 카드, 미등록이면 초록 안심 카드가 화면 중앙에 표시됩니다.",
    images: [
      { src: "/guide/11_jinsang_warning.png", caption: "🚨 진상 경고" },
      { src: "/guide/12_safe_overlay.png", caption: "✅ 안심 표시" },
    ],
  },
  {
    title: "4. 내 업소 정보 관리",
    desc: "프로필에서 업소명, 지역, 업종을 설정하고 구독 상태를 확인할 수 있습니다. '업소명 공개' 토글을 켜면 진상 경고 시 다른 업소에 내 이름이 표시됩니다.",
    images: [],
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white/50 hover:text-white transition text-sm">
            ← 홈으로
          </Link>
          <h1 className="text-lg font-bold">📖 사용법</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* 인트로 */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-black mb-4">얘진상 사용 가이드</h2>
          <p className="text-white/50 text-lg">
            설치부터 진상 감지까지, 5분이면 충분합니다.
          </p>
        </motion.div>

        {/* 섹션들 */}
        {sections.map((section, si) => (
          <motion.section
            key={si}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={si}
            variants={fadeUp}
            className="mb-20"
          >
            <h3 className="text-2xl font-bold mb-3">{section.title}</h3>
            <p className="text-white/60 mb-8 leading-relaxed">{section.desc}</p>

            <div className={`grid gap-4 ${
              section.images.length === 1 
                ? "grid-cols-1 max-w-xs mx-auto" 
                : section.images.length === 2 
                  ? "grid-cols-2" 
                  : "grid-cols-2 md:grid-cols-4"
            }`}>
              {section.images.map((img, ii) => (
                <div key={ii} className="flex flex-col items-center">
                  <div className="relative w-full aspect-[9/19] rounded-2xl overflow-hidden border border-white/10 bg-[#1A1A1A]">
                    <Image
                      src={img.src}
                      alt={img.caption}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <span className="text-xs text-white/40 mt-2">{img.caption}</span>
                </div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="text-center py-12 border-t border-white/10"
        >
          <h3 className="text-2xl font-bold mb-4">지금 바로 시작하세요</h3>
          <p className="text-white/50 mb-8">
            같은 진상에 두 번 당할 필요 없습니다.
          </p>
          <Link
            href="https://github.com/LeeJaeBae/yae-jinsang/releases/tag/v1.1.0"
            className="inline-block px-8 py-4 bg-[#FF3B30] text-white font-bold rounded-xl hover:bg-[#E0352B] transition"
          >
            📥 APK 다운로드
          </Link>
        </motion.div>

        <div className="text-center py-8">
          <Link href="/" className="text-white/30 hover:text-white/50 transition text-sm">
            ← 메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

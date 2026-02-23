import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "얘진상 — 진상 손님 사전 차단 시스템",
  description: "수신 전화만으로 진상 손님을 즉시 식별. 업소간 블랙리스트 공유로 미리 대비하세요.",
  keywords: ["진상", "블랙리스트", "유흥", "전화", "차단", "손님관리"],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "얘진상 — 진상 손님 사전 차단 시스템",
    description: "수신 전화만으로 진상 손님을 즉시 식별",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

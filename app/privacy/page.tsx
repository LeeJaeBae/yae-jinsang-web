export default function Privacy() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <a href="/" className="text-brand-red-light text-sm hover:underline">← 홈으로</a>
        <h1 className="text-4xl font-black mt-6 mb-2">개인정보처리방침</h1>
        <p className="text-white/30 text-sm mb-12">최종 수정일: 2026년 2월 24일</p>

        <div className="space-y-10 text-white/60 text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-bold mb-3">1. 개인정보의 수집 및 이용 목적</h2>
            <p>더 비스포크(이하 &quot;회사&quot;)는 얘진상 서비스(이하 &quot;서비스&quot;) 제공을 위해 다음의 목적으로 개인정보를 수집 및 이용합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>회원 가입 및 본인 인증</li>
              <li>서비스 제공 및 이용 관리</li>
              <li>요금 결제 및 구독 관리</li>
              <li>서비스 개선 및 통계 분석</li>
              <li>고객 문의 대응</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">2. 수집하는 개인정보 항목</h2>
            <div className="bg-brand-card rounded-xl p-5 space-y-3">
              <div>
                <p className="text-white font-semibold text-sm">필수 항목</p>
                <p className="mt-1">휴대전화번호 (인증용), 업소명</p>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">자동 수집 항목</p>
                <p className="mt-1">서비스 이용 기록, 접속 로그, 기기 정보</p>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">⚠️ 수집하지 않는 항목</p>
                <p className="mt-1 text-brand-red-light">등록 대상의 전화번호 원본은 수집하지 않습니다. 전화번호는 SHA-256 해시로 변환되어 저장되며, 원본 복원이 불가능합니다.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">3. 개인정보의 보유 및 이용 기간</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">회원 정보:</strong> 회원 탈퇴 시까지 (탈퇴 후 즉시 파기)</li>
              <li><strong className="text-white">결제 정보:</strong> 관련 법령에 따라 5년간 보관</li>
              <li><strong className="text-white">태그 데이터:</strong> 해시 + 태그 정보는 등록 업소 탈퇴 시 삭제</li>
              <li><strong className="text-white">서비스 이용 로그:</strong> 6개월간 보관 후 파기</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">4. 개인정보의 제3자 제공</h2>
            <p>회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 의거하거나 수사기관의 요청이 있는 경우</li>
            </ul>
            <div className="bg-brand-card rounded-xl p-4 mt-4">
              <p className="text-brand-red-light text-sm">📌 태그 정보의 공유에 대하여</p>
              <p className="mt-2">다른 업소에 공유되는 정보는 &quot;해당 번호 해시에 N건의 주의 태그가 등록됨&quot;이라는 통계 정보뿐입니다. 어느 업소가 등록했는지, 구체적인 메모 내용은 공유되지 않습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">5. 개인정보의 안전성 확보 조치</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>전화번호 해시 처리 (SHA-256, 원본 비저장)</li>
              <li>데이터베이스 접근 통제 (Row Level Security)</li>
              <li>통신 구간 암호화 (HTTPS/TLS)</li>
              <li>정기적 보안 점검</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">6. 이용자의 권리</h2>
            <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>개인정보 열람 요청</li>
              <li>개인정보 정정 및 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>회원 탈퇴 (모든 데이터 즉시 삭제)</li>
            </ul>
            <p className="mt-3">위 권리 행사는 <a href="mailto:hello@thebespoke.team" className="text-brand-red-light hover:underline">hello@thebespoke.team</a>으로 요청해 주세요.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">7. 개인정보 보호책임자</h2>
            <div className="bg-brand-card rounded-xl p-5">
              <p><strong className="text-white">성명:</strong> 이재원</p>
              <p><strong className="text-white">직책:</strong> 대표</p>
              <p><strong className="text-white">이메일:</strong> <a href="mailto:hello@thebespoke.team" className="text-brand-red-light hover:underline">hello@thebespoke.team</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">8. 개인정보 처리방침의 변경</h2>
            <p>본 방침은 시행일로부터 적용되며, 변경 사항이 있는 경우 서비스 내 공지를 통해 안내합니다.</p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <p className="text-white/30">
              본 개인정보처리방침은 2026년 2월 24일부터 시행합니다.<br />
              사업자: 더 비스포크 | 대표: 이재원<br />
              문의: hello@thebespoke.team
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

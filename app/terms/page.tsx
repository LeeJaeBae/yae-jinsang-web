export default function Terms() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <a href="/" className="text-brand-red-light text-sm hover:underline">← 홈으로</a>
        <h1 className="text-4xl font-black mt-6 mb-2">이용약관</h1>
        <p className="text-white/30 text-sm mb-12">최종 수정일: 2026년 2월 24일</p>

        <div className="space-y-10 text-white/60 text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-bold mb-3">제1조 (목적)</h2>
            <p>본 약관은 더 비스포크(이하 &quot;회사&quot;)가 제공하는 얘진상 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제2조 (정의)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>&quot;서비스&quot;란 회사가 제공하는 수신 전화 진상 식별 및 업소간 블랙리스트 공유 서비스를 말합니다.</li>
              <li>&quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 자를 말합니다.</li>
              <li>&quot;업소&quot;란 서비스에 가입한 사업장 단위를 말합니다.</li>
              <li>&quot;태그&quot;란 특정 전화번호에 대해 이용자가 등록한 주의 정보를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 적용일자 7일 전에 공지합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제4조 (서비스의 내용)</h2>
            <p>회사가 제공하는 서비스는 다음과 같습니다.</p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>수신 전화번호의 암호화 해시를 이용한 진상 여부 조회</li>
              <li>전화번호 해시 기반 태그(주의 정보) 등록 및 관리</li>
              <li>업소간 태그 정보 공유 (전화번호 원본 제외)</li>
              <li>수신 전화 시 실시간 경고 알림</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제5조 (이용 계약의 성립)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>이용 계약은 이용자가 본 약관에 동의하고 전화번호 인증을 완료한 후, 회사가 이를 승인함으로써 성립됩니다.</li>
              <li>회사는 다음 각 호에 해당하는 경우 가입을 거부할 수 있습니다.
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>타인의 정보를 이용한 경우</li>
                  <li>허위 정보를 기재한 경우</li>
                  <li>기타 회사가 정한 이용 조건을 충족하지 못한 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제6조 (이용자의 의무)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>이용자는 허위 또는 악의적인 태그를 등록해서는 안 됩니다.</li>
              <li>이용자는 서비스를 통해 얻은 정보를 본래 목적 외로 사용하거나 제3자에게 제공해서는 안 됩니다.</li>
              <li>이용자는 타인의 명예를 훼손하거나 불이익을 주는 행위를 해서는 안 됩니다.</li>
              <li>이용자는 관련 법령, 본 약관, 서비스 이용 안내 등을 준수해야 합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제7조 (요금 및 결제)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스는 유료 구독제로 운영되며, 요금은 서비스 내에 별도 안내합니다.</li>
              <li>결제는 계좌이체 방식으로 진행되며, 입금 확인 후 서비스가 활성화됩니다.</li>
              <li>이미 결제한 구독료는 이용 기간이 시작된 후에는 환불되지 않습니다. 단, 서비스 장애 등 회사 귀책 사유의 경우 일할 계산하여 환불합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제8조 (서비스 이용 제한)</h2>
            <p>회사는 이용자가 다음 각 호에 해당하는 경우 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.</p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>허위 태그를 반복적으로 등록하는 경우</li>
              <li>서비스를 악용하여 타인에게 피해를 주는 경우</li>
              <li>관련 법령 또는 본 약관을 위반하는 경우</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제9조 (면책 조항)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회사는 이용자가 등록한 태그의 정확성, 신뢰성에 대해 보증하지 않습니다.</li>
              <li>회사는 서비스에서 제공하는 정보를 기반으로 한 이용자의 판단 및 행위에 대해 책임지지 않습니다.</li>
              <li>천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 회사는 책임지지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제10조 (분쟁 해결)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 상호 협의하여 해결합니다.</li>
              <li>협의가 이루어지지 않는 경우, 관할 법원은 회사 소재지의 법원으로 합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">제11조 (기타)</h2>
            <p>본 약관에서 정하지 않은 사항은 관련 법령 및 상관례에 따릅니다.</p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <p className="text-white/30">
              본 약관은 2026년 2월 24일부터 시행합니다.<br />
              사업자: 더 비스포크 | 대표: 이재원<br />
              문의: hello@thebespoke.team
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'white', paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ 
                padding: '16px 20px', background: 'white', 
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: '0 1px 0 rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10
            }}>
                <ChevronLeft size={24} cursor="pointer" onClick={() => navigate(-1)} />
                <h1 style={{ fontSize: '18px', fontWeight: 700 }}>이용약관 및 개인정보처리방침</h1>
            </div>

            <div style={{ padding: '24px 20px', lineHeight: '1.6', color: '#333', fontSize: '14px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>1. 서비스 이용약관</h2>
                <p style={{ marginBottom: '20px' }}>
                    <strong>제1조 (목적)</strong><br/>
                    본 약관은 'AllergyTable'(이하 "회사")이 제공하는 알러지 안심 외식 정보 제공 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
                <p style={{ marginBottom: '20px' }}>
                    <strong>제2조 (서비스의 정의)</strong><br/>
                    "서비스"란 회원이 자신의 알러지 정보를 등록하고, 이를 바탕으로 알러지 유발 성분이 포함되지 않은 식당 메뉴 정보를 검색하거나 확인할 수 있도록 돕는 제반 서비스를 의미합니다.<br/>
                    <span style={{ color: 'var(--danger-red)', fontWeight: 600 }}>※ 주의: 본 서비스가 제공하는 정보는 참고용이며, 의학적 진단을 대신할 수 없습니다. 실제 섭취 전 식당 직원에게 반드시 재확인해야 합니다.</span>
                </p>
                <p style={{ marginBottom: '20px' }}>
                    <strong>제3조 (면책 조항)</strong><br/>
                    1. 회사는 식당이 제공한 메뉴 정보의 정확성을 보장하기 위해 노력하지만, 식당 측의 레시피 변경이나 교차 오염 등으로 인한 사고에 대해서는 법적 책임을 지지 않습니다.<br/>
                    2. 회원은 본인의 알러지 정보를 정확게 기입해야 하며, 부정확한 정보 입력으로 인한 불이익은 회원이 부담합니다.
                </p>

                <div style={{ height: '1px', background: '#eee', margin: '30px 0' }}></div>

                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>2. 개인정보처리방침</h2>
                <p style={{ marginBottom: '20px' }}>
                    'AllergyTable'은 사용자의 개인정보를 중요시하며, "개인정보 보호법"을 준수하고 있습니다.
                </p>

                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>1. 수집하는 개인정보 항목</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                    <li>필수항목: 이메일 주소, 닉네임 (소셜 로그인 시 제공받는 정보)</li>
                    <li>선택항목: 개인별 알러지 정보, 기피 식재료, 알러지 심각도</li>
                </ul>

                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>2. 개인정보의 수집 및 이용목적</h3>
                <p style={{ marginBottom: '20px' }}>
                    회사는 수집한 개인정보를 다음의 목적으로만 활용합니다.<br/>
                    - 회원 관리: 본인 확인, 개인 식별, 알러지 맞춤형 콘텐츠 제공<br/>
                    - 서비스 제공: 사용자 알러지 정보에 기반한 식당 및 메뉴 필터링 기능 제공
                </p>

                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>3. 개인정보의 보유 및 이용기간</h3>
                <p style={{ marginBottom: '20px' }}>
                    원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 회원이 탈퇴를 요청하거나 동의를 철회하는 경우 즉시 파기합니다.
                </p>

                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>4. 개인정보 보호책임자</h3>
                <p style={{ marginBottom: '20px' }}>
                    이메일: dingko1006@gmail.com
                </p>

                <div style={{ height: '1px', background: '#eee', margin: '30px 0' }}></div>

                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>3. 위치기반서비스 이용약관</h2>
                
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>1. 목적</h3>
                <p style={{ marginBottom: '20px' }}>
                    본 약관은 회사가 제공하는 위치기반서비스와 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>

                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>2. 서비스 내용</h3>
                <p style={{ marginBottom: '20px' }}>
                    회사는 이용자의 현재 위치를 기반으로 주변 식당 정보 및 메뉴 추천 서비스를 제공합니다.
                </p>

                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>3. 위치정보의 이용 및 보유기간</h3>
                <p style={{ marginBottom: '20px' }}>
                    회사는 서비스 제공을 위해 필요한 최소한의 기간 동안만 위치정보를 이용하며, 해당 목적 달성 후 즉시 파기합니다. 별도의 저장소에 이용자의 이동 경로 로그를 보관하지 않습니다.
                </p>

                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>4. 위치정보 관리책임자</h3>
                <p style={{ marginBottom: '20px' }}>
                    이메일: dingko1006@gmail.com
                </p>
            </div>
        </div>
    );
};

export default TermsPage;

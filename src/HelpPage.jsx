import React from 'react';
import { ChevronLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'white' }}>
            {/* Header */}
            <div style={{ 
                padding: '16px 20px', background: 'white', 
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: '0 1px 0 rgba(0,0,0,0.05)'
            }}>
                <ChevronLeft size={24} cursor="pointer" onClick={() => navigate(-1)} />
                <h1 style={{ fontSize: '18px', fontWeight: 700 }}>고객센터 / 도움말</h1>
            </div>

            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ 
                    width: '80px', height: '80px', background: 'var(--primary-light)', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <Mail size={40} color="var(--primary-color)" />
                </div>
                
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#333' }}>
                    무엇을 도와드릴까요?
                </h2>
                <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '40px' }}>
                    서비스 이용 중 불편한 점이나<br/>
                    개선할 점이 있다면 언제든지 말씀해 주세요.<br/>
                    빠르게 확인 후 답변 드리겠습니다.
                </p>

                <div style={{ 
                    background: '#F8F9FA', padding: '20px', borderRadius: '16px',
                    border: '1px solid #eee'
                }}>
                    <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>공식 이메일</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#333', userSelect: 'all' }}>
                        dingko1006@gmail.com
                    </div>
                </div>

                <div style={{ marginTop: '40px', fontSize: '13px', color: '#aaa' }}>
                    운영 시간: 평일 10:00 - 18:00 (주말/공휴일 휴무)
                </div>
            </div>
        </div>
    );
};

export default HelpPage;

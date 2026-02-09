import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Calendar, Clock, Users, AlertCircle, Home } from 'lucide-react';
import './index.css';

const ReservationSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { restaurant, date, time, people, allergyInfo } = location.state || {};

    if (!restaurant) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>잘못된 접근입니다.</div>;

    return (
        <div className="reservation-success-container" style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: `url(${restaurant.image}) no-repeat center center/cover`,
        }}>
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                zIndex: 1
            }}></div>

            {/* Content Card */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px 24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                color: 'white'
            }}>
                {/* Animated Check Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--safe-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)'
                }}>
                    <Check size={40} color="white" strokeWidth={3} />
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>예약 확정!</h1>
                <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '32px' }}>
                    {restaurant.name} 예약이 완료되었습니다.
                </p>

                {/* Details */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                        <Calendar size={20} style={{ opacity: 0.7 }} />
                        <span>{date || '2026.02.10 (금)'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                        <Clock size={20} style={{ opacity: 0.7 }} />
                        <span>{time || '19:30'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                        <Users size={20} style={{ opacity: 0.7 }} />
                        <span>{people || 2}명</span>
                    </div>
                    {(allergyInfo || restaurant.safeFor) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,59,48,0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,59,48,0.3)' }}>
                            <AlertCircle size={20} color="#FF453A" />
                            <span style={{ color: '#FF453A', fontWeight: 600 }}>
                                알러지 정보: {allergyInfo || '전달 완료'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <button style={{
                    width: '100%',
                    padding: '16px',
                    background: 'white',
                    color: 'black',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: 700,
                    marginBottom: '12px',
                    cursor: 'pointer'
                }}>
                    캘린더에 추가
                </button>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        color: 'white',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        padding: '8px',
                        opacity: 0.8
                    }}>
                    메인으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default ReservationSuccess;

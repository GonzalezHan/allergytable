import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Star, MapPin, Clock, Phone, ShieldCheck, Heart, ChevronRight } from 'lucide-react';
import { mockRestaurants, allergensList } from './data.jsx';
import './index.css';

import { useRestaurant } from './hooks/useRestaurants';

const RestaurantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { restaurant, loading, error } = useRestaurant(id);
    const [isFavorite, setIsFavorite] = useState(false);

    if (loading) return <div>Loading...</div>;
    if (error || !restaurant) return <div>Restaurant not found</div>;

    const safeAllergens = restaurant.safeFor ? restaurant.safeFor.map(aid => allergensList.find(a => a.id === aid)) : [];

    const handleCall = (phone) => {
        alert(`${phone} 번호로 전화를 겁니다.`);
    };

    const handleReserve = (restaurant) => {
        // In real app, this would open a modal to select date/time/people
        // For now, we simulate a successful reservation with default values
        navigate('/reservation-success', {
            state: {
                restaurant: restaurant,
                date: '2026.02.14 (토)',
                time: '18:00',
                people: 2,
                allergyInfo: '계란, 우유 제외 요청'
            }
        });
    };

    return (
        <div className="restaurant-detail-container" style={{ position: 'relative', background: 'var(--surface-color)', minHeight: '100vh', paddingBottom: '90px' }}>

            {/* 1. Transparent Header */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)'
            }}>
                <button onClick={() => navigate(-1)} style={{ color: 'white', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={24} />
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ color: 'white', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isFavorite ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} onClick={() => setIsFavorite(!isFavorite)}>
                        <Heart size={24} fill={isFavorite ? "#ff4757" : "transparent"} color={isFavorite ? "#ff4757" : "white"} />
                    </button>
                    <button style={{ color: 'white', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Share2 size={24} />
                    </button>
                </div>
            </header>

            {/* 2. Hero Image */}
            <div className="detail-hero" style={{ height: '320px', width: '100%', position: 'relative' }}>
                <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {restaurant.isCertified && (
                    <div style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '20px',
                        background: 'var(--safe-green)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(0,255,0,0.2)'
                    }}>
                        <ShieldCheck size={16} />
                        자체 안심 인증 완료
                    </div>
                )}
            </div>

            {/* 3. Content Sheet */}
            <div className="detail-content" style={{
                marginTop: '-20px',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                background: 'var(--surface-color)',
                position: 'relative',
                padding: '24px 20px',
                minHeight: '500px'
            }}>
                {/* Title Section */}
                <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
                    <h1 style={{ fontSize: '26px', marginBottom: '8px' }}>{restaurant.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <span>{restaurant.type}</span>
                        <span>·</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning-yellow)' }}>
                            <Star size={16} fill="var(--warning-yellow)" color="var(--warning-yellow)" />
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{restaurant.rating}</span>
                        </div>
                        <span style={{ opacity: 0.5 }}>({restaurant.reviewCount}명 참여)</span>
                    </div>
                </div>

                {/* Safe Info Section (Highlight) */}
                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>안심 포인트 🛡️</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {safeAllergens.map(a => (
                            <div key={a.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                background: 'var(--safe-bg)',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,177,106, 0.1)'
                            }}>
                                <span style={{ fontSize: '20px' }}>{a.icon}</span>
                                <span style={{ color: 'var(--safe-green)', fontWeight: 600 }}>{a.name} 프리</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-color)', borderRadius: '12px', fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        " {restaurant.description} "
                    </div>
                </section>

                {/* Info List */}
                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>매장 정보</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <MapPin size={20} color="var(--text-tertiary)" />
                            <div style={{ flex: 1 }}>
                                <span style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{restaurant.location}</span>
                                <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>{restaurant.distance}</span>
                            </div>
                            <button style={{ border: '1px solid var(--border-color)', background: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', height: 'fit-content', cursor: 'pointer' }}>
                                복사
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Clock size={20} color="var(--text-tertiary)" />
                            <span style={{ color: 'var(--text-primary)' }}>{restaurant.hours}</span>
                            <span style={{ marginLeft: 'auto', color: restaurant.isOpen ? 'var(--safe-green)' : 'var(--danger-red)', fontWeight: 600 }}>
                                {restaurant.isOpen ? '영업중' : '영업종료'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Phone size={20} color="var(--text-tertiary)" />
                            <span style={{ color: 'var(--text-primary)' }}>0507-1234-5678</span>
                            <button onClick={() => handleCall('0507-1234-5678')} style={{ marginLeft: 'auto', color: 'var(--primary-color)', fontWeight: 600, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>전화하기</button>
                        </div>
                    </div>
                </section>

                {/* Menu Preview */}
                <section style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '18px' }}>대표 메뉴</h2>
                        <ChevronRight size={20} color="var(--text-tertiary)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {restaurant.menu.map((m, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--surface-color)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '6px' }}>{m.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                        {m.safeFor.map(sid => allergensList.find(a => a.id === sid)?.name).join(', ')} 프리
                                    </div>
                                </div>
                                <div style={{ fontWeight: 700 }}>{m.price.toLocaleString()}원</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Review Section */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '18px' }}>방문자 리뷰</h2>
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>더보기</span>
                    </div>
                    <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill="var(--warning-yellow)" color="var(--warning-yellow)" />
                            ))}
                        </div>
                        <p className="review-text" style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            "땅콩 알러지가 있는데 직원분들이 정말 꼼꼼하게 확인해주셨어요. 안심하고 먹을 수 있었습니다!"
                        </p>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                            김** 님 · 2024.02.08
                        </div>
                    </div>
                </section>
            </div>

            {/* Bottom CTAs */}
            <div className="detail-footer" style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: 'var(--max-width)',
                display: 'flex',
                gap: '12px',
                padding: '1rem 1.25rem',
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--backdrop-blur)',
                borderTop: 'var(--glass-border)',
                zIndex: 1000
            }}>
                <button
                    onClick={() => handleCall('0507-1234-5678')}
                    style={{
                        flex: 1,
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 600,
                        background: 'var(--surface-color)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Phone size={20} />
                    전화
                </button>
                <button
                    onClick={() => handleReserve(restaurant)}
                    disabled={!restaurant.canReserve}
                    className="floating-cta"
                    style={{
                        flex: 2,
                        padding: '16px',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 700,
                        background: restaurant.canReserve ? 'var(--primary-color)' : 'var(--text-tertiary)',
                        color: 'white',
                        cursor: restaurant.canReserve ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(255, 79, 40, 0.4)'
                    }}
                >
                    {restaurant.canReserve ? '예약하기' : '예약마감'}
                </button>
            </div>
        </div>
    );
};

export default RestaurantDetail;

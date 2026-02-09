import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Star, MapPin, Clock, Phone, ShieldCheck, Heart, Copy, ChevronRight } from 'lucide-react';
import { mockRestaurants, allergensList } from './data';
import './index.css';

const RestaurantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Imitate fetch
        const found = mockRestaurants.find(r => r.id === parseInt(id));
        setRestaurant(found);
    }, [id]);

    if (!restaurant) return <div>Loading...</div>;

    const safeAllergens = restaurant.safeFor.map(aid => allergensList.find(a => a.id === aid));

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
                <button onClick={() => navigate(-1)} style={{ color: 'white', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}>
                    <ChevronLeft size={24} />
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ color: 'white', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }} onClick={() => setIsFavorite(!isFavorite)}>
                        <Heart size={24} fill={isFavorite ? "#ff4757" : "transparent"} color={isFavorite ? "#ff4757" : "white"} />
                    </button>
                    <button style={{ color: 'white', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)' }}>
                            <Star size={16} fill="var(--primary-color)" />
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
                            <button style={{ border: '1px solid var(--border-color)', background: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', height: 'fit-content' }}>
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
                            <button style={{ marginLeft: 'auto', color: 'var(--primary-color)', fontWeight: 600, fontSize: '14px', background: 'none', border: 'none' }}>전화하기</button>
                        </div>
                    </div>
                </section>

                {/* Menu Preview */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '18px' }}>대표 메뉴</h2>
                        <ChevronRight size={20} color="var(--text-tertiary)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {restaurant.menu.map((m, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '6px' }}>{m.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                        {m.safeFor.map(sid => allergensList.find(a => a.id === sid)?.name).join(', ')} 프리
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <p className="review-text">
                                땅콩 알러지가 있는데 직원분들이 정말 꼼꼼하게 확인해주셨어요. 안심하고 먹을 수 있었습니다!
                            </p>
                        </div>
            </div>
        </section>
            </div >

    {/* Bottom CTAs */ }
    < div className = "detail-footer" >
                <button className="cta-btn secondary" onClick={() => onCall && onCall(restaurant.phone)}>
                    <Phone size={18} />
                    전화하기
                </button>
                <button
                    className="cta-btn primary"
                    onClick={() => onReserve && onReserve(restaurant)}
                    disabled={!restaurant.canReserve}
                >
                    예약하기
                </button>
            </div >
        </div >
    );
};

export default RestaurantDetail;

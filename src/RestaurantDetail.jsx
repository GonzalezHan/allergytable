import React from 'react';
import { ChevronLeft, Star, MapPin, Clock, Phone, Heart, ShieldCheck, Navigation } from 'lucide-react';
import './index.css';

const allergensList = [
    { id: 'egg', name: '계란', icon: '🥚' },
    { id: 'peanut', name: '땅콩', icon: '🥜' },
    { id: 'dairy', name: '유제품', icon: '🥛' },
    { id: 'wheat', name: '밀', icon: '🌾' },
    { id: 'soy', name: '대두', icon: '🫘' },
    { id: 'shellfish', name: '갑각류', icon: '🦐' },
];

const RestaurantDetail = ({ restaurant, onBack, onCall, onReserve, onToggleFavorite, isFavorite }) => {
    if (!restaurant) return null;

    return (
        <div className="restaurant-detail-container">
            {/* Hero Image */}
            <div className="detail-hero">
                <img src={restaurant.image} alt={restaurant.name} />
                <button className="detail-back-btn" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
                <button
                    className="detail-favorite-btn"
                    onClick={() => onToggleFavorite && onToggleFavorite(restaurant.id)}
                >
                    <Heart
                        size={24}
                        fill={isFavorite ? "#ff4757" : "transparent"}
                        color={isFavorite ? "#ff4757" : "white"}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="detail-content">
                {/* Header Info */}
                <div className="detail-header">
                    <div className="detail-title-row">
                        <h1>{restaurant.name}</h1>
                        {restaurant.isCertified && (
                            <span className="certified-badge">
                                <ShieldCheck size={16} />
                                안심 인증
                            </span>
                        )}
                    </div>
                    <p className="detail-type">{restaurant.type}</p>
                    <div className="detail-rating">
                        <Star size={16} fill="#F59E0B" color="#F59E0B" />
                        <span className="rating-value">{restaurant.rating}</span>
                        <span className="review-count">리뷰 {restaurant.reviewCount}개</span>
                    </div>
                </div>

                {/* Allergy Safety Section */}
                <section className="detail-section">
                    <h2>🛡️ 알러지 안심 정보</h2>
                    <div className="safety-badges">
                        {restaurant.safeFor?.map(aid => (
                            <div key={aid} className="safety-badge-large">
                                <span className="badge-icon">{allergensList.find(a => a.id === aid)?.icon}</span>
                                <span className="badge-text">{allergensList.find(a => a.id === aid)?.name} 안심</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Info Section */}
                <section className="detail-section">
                    <h2>📍 매장 정보</h2>
                    <div className="info-list">
                        <div className="info-item">
                            <MapPin size={18} />
                            <span>{restaurant.address || '서울시 강남구 역삼동 123-45'}</span>
                            <button className="direction-btn">
                                <Navigation size={14} />
                                길찾기
                            </button>
                        </div>
                        <div className="info-item">
                            <Clock size={18} />
                            <span className={restaurant.isOpen ? 'open' : 'closed'}>
                                {restaurant.isOpen ? '영업중' : '영업종료'}
                            </span>
                            <span>{restaurant.hours}</span>
                        </div>
                        <div className="info-item">
                            <Phone size={18} />
                            <span>{restaurant.phone || '02-1234-5678'}</span>
                        </div>
                    </div>
                </section>

                {/* Popular Menu */}
                {restaurant.menu && (
                    <section className="detail-section">
                        <h2>🍽️ 대표 메뉴</h2>
                        <div className="menu-list">
                            {restaurant.menu.map((item, idx) => (
                                <div key={idx} className="menu-item">
                                    <div className="menu-info">
                                        <span className="menu-name">{item.name}</span>
                                        <div className="menu-allergens">
                                            {item.safeFor?.map(aid => (
                                                <span key={aid} className="menu-safe-tag">
                                                    {allergensList.find(a => a.id === aid)?.icon}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="menu-price">{item.price?.toLocaleString()}원</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews Preview */}
                <section className="detail-section">
                    <h2>💬 알러지 관련 리뷰</h2>
                    <div className="reviews-preview">
                        <div className="review-item">
                            <div className="review-header">
                                <span className="reviewer-name">김안심</span>
                                <div className="review-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                                    ))}
                                </div>
                            </div>
                            <p className="review-text">
                                땅콩 알러지가 있는데 직원분들이 정말 꼼꼼하게 확인해주셨어요. 안심하고 먹을 수 있었습니다!
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Bottom CTAs */}
            <div className="detail-footer">
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
            </div>
        </div>
    );
};

export default RestaurantDetail;

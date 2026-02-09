import React, { useState } from 'react';
import { Heart, Star, MapPin, ChevronLeft, Bookmark } from 'lucide-react';
import './index.css';

const allergensList = [
    { id: 'egg', name: '계란', icon: '🥚' },
    { id: 'peanut', name: '땅콩', icon: '🥜' },
    { id: 'dairy', name: '유제품', icon: '🥛' },
    { id: 'wheat', name: '밀', icon: '🌾' },
    { id: 'soy', name: '대두', icon: '🫘' },
    { id: 'shellfish', name: '갑각류', icon: '🦐' },
];

const FavoritesPage = ({ favorites = [], onBack, onRemoveFavorite, onRestaurantClick }) => {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', name: '전체' },
        { id: 'recent', name: '최근 방문' },
        { id: 'reservable', name: '예약 가능' },
    ];

    const filteredFavorites = favorites.filter(restaurant => {
        if (activeTab === 'all') return true;
        if (activeTab === 'recent') return restaurant.recentlyVisited;
        if (activeTab === 'reservable') return restaurant.canReserve;
        return true;
    });

    return (
        <div className="favorites-container">
            {/* Header */}
            <header className="favorites-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
                <h1>
                    <Heart size={20} fill="var(--safe-green)" color="var(--safe-green)" />
                    즐겨찾기
                </h1>
                <div style={{ width: 24 }} />
            </header>

            {/* Tab Filters */}
            <div className="favorites-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Favorites List */}
            <div className="favorites-content">
                {filteredFavorites.length === 0 ? (
                    <div className="empty-state">
                        <Bookmark size={64} color="#ddd" />
                        <h3>아직 저장한 식당이 없어요</h3>
                        <p>마음에 드는 안심 식당을 발견하면<br />하트를 눌러 저장해보세요!</p>
                    </div>
                ) : (
                    <div className="favorites-list">
                        {filteredFavorites.map(restaurant => (
                            <div
                                key={restaurant.id}
                                className="favorite-card"
                                onClick={() => onRestaurantClick && onRestaurantClick(restaurant)}
                            >
                                <div className="favorite-card-image">
                                    <img src={restaurant.image} alt={restaurant.name} />
                                    <button
                                        className="unfavorite-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFavorite && onRemoveFavorite(restaurant.id);
                                        }}
                                    >
                                        <Heart size={18} fill="#ff4757" color="#ff4757" />
                                    </button>
                                </div>
                                <div className="favorite-card-info">
                                    <div className="favorite-card-header">
                                        <h3>{restaurant.name}</h3>
                                        <div className="favorite-card-rating">
                                            <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                            <span>{restaurant.rating}</span>
                                            <span className="review-count">({restaurant.reviewCount})</span>
                                        </div>
                                    </div>
                                    <p className="favorite-card-meta">
                                        {restaurant.type} · <MapPin size={12} /> {restaurant.distance}
                                    </p>
                                    <div className="favorite-card-badges">
                                        {restaurant.safeFor?.map(aid => (
                                            <span key={aid} className="safe-badge">
                                                {allergensList.find(a => a.id === aid)?.name} 안심
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;

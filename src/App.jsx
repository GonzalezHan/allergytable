import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { Search, User, SlidersHorizontal, ShieldCheck, MapPin, Star, List, Heart } from 'lucide-react'
import MapView from './MapView'
import LoginPage from './LoginPage'
import AllergyProfileSetup from './AllergyProfileSetup'
import FavoritesPage from './FavoritesPage'
import RestaurantDetail from './RestaurantDetail'
import { AuthProvider, useAuth } from './AuthContext'
import './index.css'

const allergensList = [
    { id: 'egg', name: '계란', icon: '🥚' },
    { id: 'peanut', name: '땅콩', icon: '🥜' },
    { id: 'dairy', name: '유제품', icon: '🥛' },
    { id: 'wheat', name: '밀', icon: '🌾' },
    { id: 'soy', name: '대두', icon: '🫘' },
    { id: 'shellfish', name: '갑각류', icon: '🦐' },
]

const mockRestaurants = [
    {
        id: 1,
        name: '그린 베이커리',
        type: '카페/빵집',
        distance: '300m',
        rating: 4.8,
        reviewCount: 328,
        hours: '09:00 - 21:00',
        isOpen: true,
        canReserve: true,
        isCertified: true,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        safeFor: ['egg', 'peanut', 'dairy'],
        position: [37.5685, 126.9800],
        menu: [
            { name: '글루텐프리 브라우니', price: 5500, safeFor: ['wheat', 'egg'] },
            { name: '비건 당근케이크', price: 6000, safeFor: ['egg', 'dairy'] },
        ]
    },
    {
        id: 2,
        name: '비건 키친',
        type: '퓨전 한식',
        distance: '850m',
        rating: 4.9,
        reviewCount: 512,
        hours: '11:00 - 22:00',
        isOpen: true,
        canReserve: false,
        isCertified: true,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        safeFor: ['dairy', 'wheat', 'soy', 'shellfish'],
        position: [37.5645, 126.9750],
        menu: [
            { name: '두부스테이크', price: 15000, safeFor: ['dairy', 'egg'] },
            { name: '버섯불고기', price: 13000, safeFor: ['dairy', 'wheat'] },
        ]
    }
]

// RequireAuth Component
function RequireAuth({ children }) {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

// Home Page Component
function HomePage() {
    const navigate = useNavigate()
    const [viewMode, setViewMode] = useState('list')
    const [selectedAllergies, setSelectedAllergies] = useState(['egg', 'dairy'])
    const [favorites, setFavorites] = useState([1]) // Restaurant IDs

    const toggleAllergy = (id) => {
        setSelectedAllergies(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    const toggleFavorite = (restaurantId) => {
        setFavorites(prev =>
            prev.includes(restaurantId)
                ? prev.filter(id => id !== restaurantId)
                : [...prev, restaurantId]
        )
    }

    return (
        <div className="app-container">
            {/* Header */}
            <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--safe-green)', letterSpacing: '0.05em' }}>안심 다이닝</p>
                    <h1 style={{ fontSize: '1.4rem' }}>알러지테이블</h1>
                </div>
                <button className="allergy-chip active" style={{ borderRadius: '12px' }}>
                    <ShieldCheck size={18} /> 안심
                </button>
            </header>

            {/* Main Content */}
            <main style={{ padding: '0 1.5rem 5rem' }}>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} size={20} />
                    <input
                        type="text"
                        placeholder="식당이나 메뉴를 검색해보세요"
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            borderRadius: '15px',
                            border: '1px solid #eee',
                            fontSize: '1rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Allergy Filter Grid */}
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>내 알러지 필터</h2>
                        <SlidersHorizontal size={18} color="#666" />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {allergensList.map(allergen => (
                            <div
                                key={allergen.id}
                                className={`allergy-chip ${selectedAllergies.includes(allergen.id) ? 'active' : ''}`}
                                onClick={() => toggleAllergy(allergen.id)}
                            >
                                <span>{allergen.icon}</span>
                                {allergen.name}
                            </div>
                        ))}
                    </div>
                </section>

                {/* View Toggle */}
                <div className="view-toggle">
                    <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                        <List size={16} /> 리스트
                    </button>
                    <button className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}>
                        <MapPin size={16} /> 지도
                    </button>
                </div>

                {/* Dynamic Content: List or Map */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>{viewMode === 'list' ? '추천 안심 식당' : '주변 안심 레이더'}</h2>
                        {viewMode === 'list' && <span style={{ fontSize: '0.8rem', color: 'var(--safe-green)', fontWeight: 700 }}>{mockRestaurants.length}개의 매장</span>}
                    </div>

                    {viewMode === 'list' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {mockRestaurants.map(res => (
                                <div
                                    key={res.id}
                                    className="float-card"
                                    style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                                    onClick={() => navigate(`/restaurant/${res.id}`)}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <img src={res.image} alt={res.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                        {res.canReserve && (
                                            <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--safe-green)', color: 'white', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>예약 가능</span>
                                        )}
                                        <button
                                            style={{
                                                position: 'absolute',
                                                top: '0.75rem',
                                                left: '0.75rem',
                                                background: 'rgba(255,255,255,0.9)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                padding: '0.4rem',
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleFavorite(res.id)
                                            }}
                                        >
                                            <Heart
                                                size={18}
                                                fill={favorites.includes(res.id) ? '#ff4757' : 'transparent'}
                                                color={favorites.includes(res.id) ? '#ff4757' : '#999'}
                                            />
                                        </button>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem' }}>{res.name}</h3>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.type} · {res.distance}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F59E0B' }}>
                                                <Star size={14} fill="#F59E0B" />
                                                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{res.rating}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({res.reviewCount})</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <span style={{ color: res.isOpen ? 'var(--safe-green)' : 'var(--danger-red)', fontWeight: 600 }}>{res.isOpen ? '영업중' : '영업종료'}</span>
                                            <span>·</span>
                                            <span>{res.hours}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                            {res.safeFor.map(aid => (
                                                <div key={aid} style={{ background: 'var(--safe-green-soft)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--safe-green-dark)', fontWeight: 600 }}>
                                                    {allergensList.find(a => a.id === aid)?.name} 안심
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <MapView restaurants={mockRestaurants} selectedAllergies={selectedAllergies} />
                    )}
                </section>
            </main>

            {/* Bottom Nav */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
                height: '65px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 1rem',
                boxSizing: 'border-box'
            }}>
                <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--safe-green)', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    <MapPin size={24} />
                    <span style={{ fontSize: '0.7rem' }}>탐색</span>
                </div>
                <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#ccc', cursor: 'pointer' }}
                    onClick={() => navigate('/favorites')}
                >
                    <Star size={24} />
                    <span style={{ fontSize: '0.7rem' }}>즐겨찾기</span>
                </div>
                <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#ccc', cursor: 'pointer' }}
                    onClick={() => navigate('/profile')}
                >
                    <User size={24} />
                    <span style={{ fontSize: '0.7rem' }}>마이</span>
                </div>
            </nav>
        </div>
    )
}

// Favorites Page Wrapper
function FavoritesPageWrapper() {
    const navigate = useNavigate()
    const favoriteRestaurants = mockRestaurants.filter(r => [1].includes(r.id))

    return (
        <FavoritesPage
            favorites={favoriteRestaurants}
            onBack={() => navigate('/')}
            onRestaurantClick={(r) => navigate(`/restaurant/${r.id}`)}
        />
    )
}

// Restaurant Detail Wrapper
function RestaurantDetailWrapper() {
    const navigate = useNavigate()
    // For demo, always show first restaurant
    const restaurant = mockRestaurants[0]

    return (
        <RestaurantDetail
            restaurant={restaurant}
            onBack={() => navigate('/')}
            isFavorite={true}
        />
    )
}

// Profile Page Wrapper
function ProfilePageWrapper() {
    const navigate = useNavigate()

    return (
        <AllergyProfileSetup
            onBack={() => navigate('/')}
            onSave={(data) => {
                console.log('Profile saved:', data)
                navigate('/')
            }}
            initialAllergies={['egg', 'dairy']}
        />
    )
}

// Main App with Router
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={<HomePage />}
                    />
                    <Route
                        path="/favorites"
                        element={
                            <RequireAuth>
                                <FavoritesPageWrapper />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <RequireAuth>
                                <ProfilePageWrapper />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/restaurant/:id"
                        element={<RestaurantDetailWrapper />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App

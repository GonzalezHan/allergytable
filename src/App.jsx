import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { Search, User, SlidersHorizontal, ShieldCheck, MapPin, Star, List, Heart, Bell, ChevronDown, Coffee, Utensils, Pizza, Carrot, Home, Camera, Bookmark } from 'lucide-react'
import MapView from './MapView'
import LoginPage from './LoginPage'
import SearchPage from './SearchPage'
import ScanPage from './ScanPage'
import AllergyProfileSetup from './AllergyProfileSetup'
import FavoritesPage from './FavoritesPage'
import RestaurantDetail from './RestaurantDetail'
import ReservationSuccess from './ReservationSuccess'
import { AuthProvider, useAuth } from './AuthContext'
import { mockRestaurants, allergensList, categories } from './data.jsx'
import { useRestaurants } from './hooks/useRestaurants'
import './index.css'

// --- Components ---

function RequireAuth({ children, allowGuest = false }) {
    const { currentUser } = useAuth();
    const location = useLocation();

    // If no user at all, redirect to login
    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is a guest but the route doesn't allow guests, redirect to login
    if (currentUser.isGuest && !allowGuest) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide on login page, restaurant detail page, reservation success, and scan page
    if (location.pathname === '/login' || location.pathname.startsWith('/restaurant/') || location.pathname === '/reservation-success' || location.pathname.startsWith('/scan')) return null;

    const navItems = [
        { path: '/', icon: <Home size={24} />, label: '홈' },
        { path: '/favorites', icon: <Star size={24} />, label: '저장' },
        { path: '/scan', icon: <Camera size={24} />, label: '촬영' },
        { path: '/map', icon: <MapPin size={24} />, label: '내주변' },
        { path: '/profile', icon: <User size={24} />, label: 'MY' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 'var(--max-width)',
            height: 'var(--nav-height)',
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'var(--backdrop-blur)',
            borderTop: 'var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: '10px', // Safety padding for iPhone home bar
            zIndex: 1000
        }}>
            {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                    <div
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: isActive ? 'var(--primary-color)' : 'var(--text-tertiary)',
                            gap: '4px',
                            width: '60px'
                        }}
                    >
                        {item.icon}
                        <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                    </div>
                )
            })}
        </nav>
    );
}

function HomePage() {
    const navigate = useNavigate()
    const [activeCategory, setActiveCategory] = useState('all');
    const { restaurants, loading } = useRestaurants();

    return (
        <div className="home-container" style={{ paddingBottom: '2rem' }}>
            {/* 1. Header & Location */}
            <header style={{
                padding: '1rem 1.25rem 0.5rem',
                backgroundColor: 'var(--surface-color)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {/* Line 1: Logo, Search, Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/logo.png" alt="AT" style={{ width: '42px', height: '42px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    
                    <div 
                        onClick={() => navigate('/search')}
                        style={{
                            flex: 1,
                            backgroundColor: 'var(--bg-color)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--text-tertiary)',
                            cursor: 'pointer'
                        }}>
                        <Search size={16} />
                        <span style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>지역, 음식, 알러지 검색</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Bookmark size={24} color="var(--text-primary)" onClick={() => navigate('/favorites')} style={{ cursor: 'pointer' }} />
                        <Bell size={24} color="var(--text-primary)" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Line 2: Location Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', paddingBottom: '0.5rem' }}>
                    <MapPin size={18} color="var(--text-primary)" style={{ marginRight: '2px' }}/>
                    <h2 style={{ fontSize: '20px' }}>서울시 강남구</h2>
                    <ChevronDown size={18} color="var(--text-primary)" />
                </div>
            </header>

            {/* 3. Category Bar */}
            <div className="no-scrollbar" style={{
                display: 'flex',
                gap: '16px',
                padding: '0 1.25rem 1.5rem',
                overflowX: 'auto',
                backgroundColor: 'var(--surface-color)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                {categories.map(cat => (
                    <div key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '48px', cursor: 'pointer' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '16px',
                            backgroundColor: activeCategory === cat.id ? 'var(--primary-color)' : 'var(--bg-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: activeCategory === cat.id ? 'white' : 'var(--text-secondary)',
                            transition: 'all 0.2s'
                        }}>
                            {cat.icon}
                        </div>
                        <span style={{ fontSize: '12px', color: activeCategory === cat.id ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: activeCategory === cat.id ? 600 : 400 }}>
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* 4. Curated Section (Horizontal Scroll) */}
            <section style={{ padding: '1.5rem 0' }}>
                <div style={{ padding: '0 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>이달의 추천 안심 식당 🌟</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>전체보기</span>
                </div>
                <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', padding: '0 1.25rem', overflowX: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: '20px', color: 'var(--text-tertiary)' }}>로딩중...</div>
                    ) : restaurants.map(res => (
                        <div key={res.id} onClick={() => navigate(`/restaurant/${res.id}`)} style={{ minWidth: '160px', width: '160px', cursor: 'pointer' }}>
                            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '200px', marginBottom: '8px' }}>
                                <img src={res.image} alt={res.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {res.canReserve && (
                                    <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                        예약가능
                                    </div>
                                )}
                            </div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>{res.name}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <Star size={12} fill="var(--warning-yellow)" color="var(--warning-yellow)" />
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{res.rating}</span>
                                <span>({res.reviewCount})</span>
                                <span>· {res.type}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Safe Zones Section */}
            <section style={{ padding: '0 0 1.5rem' }}>
                <div style={{ padding: '0 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>내 주변 안심 존 📍</h3>
                    <span onClick={() => navigate('/map')} style={{ fontSize: '12px', color: 'var(--text-tertiary)', cursor: 'pointer' }}>지도보기</span>
                </div>
                <div style={{ padding: '0 1.25rem' }}>
                    {loading ? (
                        <div>로딩중...</div>
                    ) : restaurants.slice(0, 2).map((res, idx) => (
                        <div key={res.id} onClick={() => navigate(`/restaurant/${res.id}`)} style={{
                            display: 'flex',
                            gap: '16px',
                            marginBottom: '16px',
                            borderBottom: idx !== 1 ? '1px solid var(--border-color)' : 'none',
                            paddingBottom: idx !== 1 ? '16px' : 0,
                            cursor: 'pointer'
                        }}>
                            <img src={res.image} alt={res.name} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{res.name}</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{res.location} · {res.distance}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {res.safeFor && res.safeFor.map(aid => (
                                        <span key={aid} style={{ fontSize: '11px', backgroundColor: 'var(--safe-bg)', color: 'var(--safe-green)', padding: '2px 6px', borderRadius: '4px' }}>
                                            {allergensList.find(a => a.id === aid)?.name} 안심
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

// Wrapper components for other pages to pass props if needed
function FavoritesPageWrapper() {
    const navigate = useNavigate()
    const favoriteRestaurants = mockRestaurants.filter(r => [1].includes(r.id))
    return <FavoritesPage favorites={favoriteRestaurants} onBack={() => navigate('/')} onRestaurantClick={(r) => navigate(`/restaurant/${r.id}`)} />
}

import ProfilePage from './ProfilePage'

function ProfilePageWrapper() {
    return <ProfilePage />
}

function AllergyProfileSetupWrapper() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // Load current profile for initial state
    const stored = localStorage.getItem('user_profile');
    const user = stored ? JSON.parse(stored) : { 
        name: currentUser?.displayName || "김라연", 
        birthDate: "2001.03.22",
        email: currentUser?.email || "rayeon@allergytable.com",
        allergies: [], 
        severity: 'warning' 
    };

    const handleSave = (data) => {
        const updatedUser = { ...user, ...data }; // Merge new allergies & severity
        localStorage.setItem('user_profile', JSON.stringify(updatedUser));
        console.log('Profile saved:', updatedUser);
        navigate('/profile');
    };

    return <AllergyProfileSetup 
        onBack={() => navigate('/profile')} 
        onSave={handleSave} 
        initialAllergies={user.allergies} 
        initialSeverity={user.severity}
        initialName={user.name}
    />;
}

function RestaurantDetailWrapper() {
    return <RestaurantDetail />
}

function MapViewWrapper() {
    const { restaurants } = useRestaurants();
    return <MapView restaurants={restaurants} />
}

import SettingsPage from './SettingsPage'

import TermsPage from './TermsPage'
import HelpPage from './HelpPage'

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-shell">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/search" element={<RequireAuth allowGuest={true}><SearchPage /></RequireAuth>} />
                        <Route path="/" element={<RequireAuth allowGuest={true}><HomePage /></RequireAuth>} />
                        <Route path="/favorites" element={<RequireAuth><FavoritesPageWrapper /></RequireAuth>} />
                        <Route path="/scan" element={<RequireAuth allowGuest={true}><ScanPage /></RequireAuth>} />
                        <Route path="/profile" element={<RequireAuth><ProfilePageWrapper /></RequireAuth>} />
                        <Route path="/profile/edit" element={<RequireAuth><AllergyProfileSetupWrapper /></RequireAuth>} />
                        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
                        <Route path="/settings/terms" element={<RequireAuth><TermsPage /></RequireAuth>} />
                        <Route path="/settings/help" element={<RequireAuth><HelpPage /></RequireAuth>} />
                        <Route path="/restaurant/:id" element={<RequireAuth allowGuest={true}><RestaurantDetailWrapper /></RequireAuth>} />
                        <Route path="/reservation-success" element={<RequireAuth allowGuest={true}><ReservationSuccess /></RequireAuth>} />
                        <Route path="/map" element={<RequireAuth allowGuest={true}><MapViewWrapper /></RequireAuth>} />
                    </Routes>
                    <BottomNav />
                </div>
            </Router>
            {/* Force Theme Color Override */}
            <style>{`
                :root {
                    --primary-color: #00B16A !important;
                    --primary-light: #E8F7EF !important;
                }
            `}</style>
        </AuthProvider>
    )
}

export default App;

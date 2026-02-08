import React, { useState } from 'react'
import { Search, User, SlidersHorizontal, ShieldCheck, MapPin, Star, List } from 'lucide-react'
import MapView from './MapView'
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
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        safeFor: ['egg', 'peanut', 'dairy'],
        position: [37.5685, 126.9800]
    },
    {
        id: 2,
        name: '비건 키친',
        type: '퓨전 한식',
        distance: '850m',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        safeFor: ['dairy', 'wheat', 'soy', 'shellfish'],
        position: [37.5645, 126.9750]
    }
]

function App() {
    const [activeTab, setActiveTab] = useState('explore')
    const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
    const [selectedAllergies, setSelectedAllergies] = useState(['egg', 'dairy'])
    const [searchQuery, setSearchQuery] = useState('')

    const toggleAllergy = (id) => {
        setSelectedAllergies(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    return (
        <div className="app-container">
            {/* Header */}
            <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'var(--safe-green)' }}>FEARLESS DINING</p>
                    <h1>allergytable</h1>
                </div>
                <button className="allergy-chip active" style={{ borderRadius: '12px' }}>
                    <ShieldCheck size={18} /> Safe
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
                                <div key={res.id} className="float-card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <img src={res.image} alt={res.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                    <div style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <h3 style={{ margin: '0 0 0.2rem' }}>{res.name}</h3>
                                                <p style={{ margin: 0, fontSize: '0.85rem' }}>{res.type} · {res.distance}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#ffb800' }}>
                                                <Star size={14} fill="#ffb800" />
                                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{res.rating}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem' }}>
                                            {res.safeFor.map(aid => (
                                                <div key={aid} style={{ background: 'var(--safe-green-soft)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--safe-green)', fontWeight: 700 }}>
                                                    {allergensList.find(a => a.id === aid)?.name} Safe
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--safe-green)' }}>
                    <MapPin size={24} />
                    <span style={{ fontSize: '0.7rem' }}>탐색</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#ccc' }}>
                    <Star size={24} />
                    <span style={{ fontSize: '0.7rem' }}>즐겨찾기</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#ccc' }}>
                    <User size={24} />
                    <span style={{ fontSize: '0.7rem' }}>마이</span>
                </div>
            </nav>
        </div>
    )
}

export default App

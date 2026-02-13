import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronLeft, TrendingUp } from 'lucide-react';
import { categories, allergensList, mockRestaurants } from './data';
import './index.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState(['강남역 맛집', '비건', '글루텐프리']);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    
    // Auto-focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSearch = (term) => {
        // In a real app, this would filter results or navigate to a results page
        console.log(`Searching for: ${term}, Category: ${selectedCategory}, Allergies: ${selectedAllergies}`);
        // For prototype, just go back to home with query (or implement result view here)
        // Let's implement a simple result view within this page for better UX
    };

    const toggleAllergy = (id) => {
        setSelectedAllergies(prev => 
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const clearRecent = (term) => {
        setRecentSearches(prev => prev.filter(t => t !== term));
    };

    // Filter results based on search criteria
    const filteredRestaurants = mockRestaurants.filter(r => {
        const matchesTerm = searchTerm === '' || r.name.includes(searchTerm) || r.type.includes(searchTerm) || r.location.includes(searchTerm);
        const matchesCategory = !selectedCategory || selectedCategory === 'all' || (selectedCategory === 'korean' && r.type.includes('한식')) || (selectedCategory === 'cafe' && r.type.includes('카페')) || (selectedCategory === 'western' && r.type.includes('양식') || r.type.includes('이탈리안')) || (selectedCategory === 'vegan' && r.type.includes('비건'));
        // For allergy, we want to find restaurants that are SAFE for the selected allergies
        // r.safeFor contains allergies that are NOT present (safe)
        // So if user selects 'egg' (allergy), we need r.safeFor to include 'egg'
        const matchesAllergy = selectedAllergies.length === 0 || selectedAllergies.every(a => r.safeFor.includes(a));
        
        return matchesTerm && matchesCategory && matchesAllergy;
    });

    const isSearching = searchTerm.length > 0 || selectedCategory || selectedAllergies.length > 0;

    return (
        <div className="search-page-container" style={{ 
            minHeight: '100vh', 
            background: 'var(--bg-color)',
            paddingBottom: '20px'
        }}>
            {/* 1. Header & Search Bar */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                padding: '12px 20px',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: 'white', 
                        borderRadius: '16px', 
                        padding: '12px 16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <Search size={20} color="var(--text-tertiary)" style={{ marginRight: '8px' }} />
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder="지역, 음식, 식당 검색" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                fontSize: '16px', 
                                width: '100%',
                                background: 'transparent'
                            }}
                        />
                        {searchTerm && (
                            <X 
                                size={18} 
                                color="var(--text-tertiary)" 
                                onClick={() => setSearchTerm('')} 
                                style={{ cursor: 'pointer' }} 
                            />
                        )}
                    </div>
                    <span 
                        onClick={() => navigate(-1)} 
                        style={{ 
                            fontSize: '16px', 
                            color: 'var(--text-secondary)', 
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        취소
                    </span>
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                
                {/* 2. Search Results (if searching) */}
                {isSearching ? (
                     <div className="search-results">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>검색 결과 <span style={{ color: 'var(--primary-color)' }}>{filteredRestaurants.length}</span></h2>
                        </div>
                        
                        {filteredRestaurants.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {filteredRestaurants.map(res => (
                                    <div key={res.id} onClick={() => navigate(`/restaurant/${res.id}`)} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        padding: '16px',
                                        background: 'white',
                                        borderRadius: '16px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        cursor: 'pointer'
                                    }}>
                                        <img src={res.image} alt={res.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{res.name}</h4>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{res.type} · {res.location}</p>
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
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
                                <p>검색 결과가 없습니다.</p>
                                <p style={{ fontSize: '14px', marginTop: '8px' }}>다른 검색어나 조건을 시도해보세요.</p>
                            </div>
                        )}
                     </div>
                ) : (
                    <>
                        {/* 3. Recent Searches */}
                        <section style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>최근 검색어</h3>
                                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', cursor: 'pointer' }} onClick={() => setRecentSearches([])}>모두 지우기</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {recentSearches.map((term, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 12px',
                                        background: 'white',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        color: 'var(--text-secondary)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                                        cursor: 'pointer'
                                    }}>
                                        <span onClick={() => setSearchTerm(term)}>{term}</span>
                                        <X size={14} color="#999" onClick={() => clearRecent(term)} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. Quick Filters - Category */}
                        <section style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>카테고리</h3>
                            <div className="no-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {categories.map(cat => (
                                    <div key={cat.id} 
                                        onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '60px', cursor: 'pointer' }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '18px',
                                            backgroundColor: selectedCategory === cat.id ? 'var(--primary-color)' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: selectedCategory === cat.id ? 'white' : 'var(--text-secondary)',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                            transition: 'all 0.2s'
                                        }}>
                                            {cat.icon}
                                        </div>
                                        <span style={{ fontSize: '12px', color: selectedCategory === cat.id ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: selectedCategory === cat.id ? 600 : 400 }}>
                                            {cat.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 5. Allergy-Free Selection */}
                        <section style={{ marginBottom: '32px' }}>
                             <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>알러지 프리 필터 🛡️</h3>
                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {allergensList.slice(0, 6).map(allergen => (
                                    <div 
                                        key={allergen.id}
                                        onClick={() => toggleAllergy(allergen.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 16px',
                                            borderRadius: '12px',
                                            backgroundColor: selectedAllergies.includes(allergen.id) ? 'var(--safe-bg)' : 'white',
                                            border: selectedAllergies.includes(allergen.id) ? '1px solid var(--safe-green)' : '1px solid transparent',
                                            color: selectedAllergies.includes(allergen.id) ? 'var(--safe-green)' : 'var(--text-secondary)',
                                            fontWeight: selectedAllergies.includes(allergen.id) ? 600 : 400,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span>{allergen.icon}</span>
                                        <span>{allergen.name} 프리</span>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* 6. Popular Keywords */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                                <TrendingUp size={18} color="var(--primary-color)" />
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>지금 인기있는 검색어</h3>
                            </div>
                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {['#비건베이커리', '#안심데이', '#기념일', '#글루텐프리파스타', '#강남역데이트'].map((tag, idx) => (
                                    <span key={idx} onClick={() => setSearchTerm(tag.replace('#', ''))} style={{
                                        fontSize: '14px',
                                        color: 'var(--primary-color)',
                                        background: 'rgba(255, 79, 40, 0.08)',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        cursor: 'pointer'
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                             </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;

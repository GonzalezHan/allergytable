import React, { useState, useEffect } from 'react'
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk'
import { ChevronLeft, Search, Menu, Crosshair, List, Star, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { allergensList } from './data'
import './index.css'

const MapView = ({ restaurants = [] }) => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);
    const [state, setState] = useState({
        center: { lat: 37.5665, lng: 126.9780 }, // Default: Seoul City Hall
        isPanto: false,
    });
    const [myLocation, setMyLocation] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    
    // State for Real Data from Kakao API
    const [realRestaurants, setRealRestaurants] = useState([]);

    // Modern SDK loading
    const { loading: sdkLoading, error: sdkError } = useKakaoLoader({
        appkey: "6758187da106ac91415a4fc813c1edde",
        libraries: ["services", "clusterer"],
    });

    // 1. Get User Location on Mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMyLocation(newPos);
                    setState({ center: newPos, isPanto: true });
                },
                (err) => {
                    console.error("Geolocation failed:", err);
                }
            );
        }
    }, []);

    // 2. Fetch Real Places from Kakao API when center changes
    useEffect(() => {
        if (!sdkLoading && window.kakao && window.kakao.maps && window.kakao.maps.services) {
            const ps = new window.kakao.maps.services.Places();
            
            // Search for "Food" category (FD6) around the center
            ps.categorySearch('FD6', (data, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const mappedData = data.map((place, index) => ({
                        id: place.id, // Use Kakao Place ID
                        name: place.place_name,
                        position: [parseFloat(place.y), parseFloat(place.x)],
                        type: place.category_name.split('>').pop().trim() || '음식점',
                        distance: place.distance ? `${place.distance}m` : '가까움',
                        address: place.road_address_name || place.address_name,
                        phone: place.phone,
                        url: place.place_url,
                        // --- MOCK DATA FOR DEMO (Since API doesn't provide these) ---
                        rating: (3.5 + Math.random() * 1.5).toFixed(1), // Random 3.5 ~ 5.0
                        reviewCount: Math.floor(Math.random() * 500) + 10,
                        // Randomly assign 1~3 safe allergens for demo purposes
                        safeFor: allergensList
                            .sort(() => 0.5 - Math.random())
                            .slice(0, Math.floor(Math.random() * 3) + 1)
                            .map(a => a.id),
                        image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' // Default food icon
                    }));
                    console.log("Fetched Real Places:", mappedData);
                    setRealRestaurants(mappedData);
                } else {
                    console.warn("Kakao Places Search failed or returned no results:", status);
                }
            }, {
                location: new window.kakao.maps.LatLng(state.center.lat, state.center.lng),
                radius: 2000, // 2km radius
                sort: window.kakao.maps.services.SortBy.DISTANCE
            });
        }
    }, [state.center, sdkLoading]);

    const moveToMyLocation = () => {
        if (myLocation) {
            setState({ center: myLocation, isPanto: true });
        } else {
            alert("위치 정보를 가져올 수 없습니다.");
        }
    };

    const toggleFilter = (id) => {
        setSelectedFilters(prev => 
            prev.includes(id) 
                ? prev.filter(f => f !== id) 
                : [...prev, id]
        );
        setSelectedId(null);
    };

    // Use Real Data if available, otherwise User Mock Data
    const dataToDisplay = realRestaurants.length > 0 ? realRestaurants : restaurants;

    const filteredRestaurants = dataToDisplay.filter(res => {
        if (selectedFilters.length === 0) return true;
        // Check if restaurant is safe for ALL selected allergens
        // For real data, 'safeFor' is simulated
        return selectedFilters.every(filterId => res.safeFor.includes(filterId));
    });

    if (sdkLoading) return <div className="loading-container">지도를 불러오는 중...</div>;
    if (sdkError) return <div className="loading-container">지도 로딩 중 오류가 발생했습니다.</div>;

    return (
        <div className="map-page" style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
            
            {/* --- 1. Top Layer (Search & Filters) --- */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                zIndex: 20,
                padding: '16px 16px 0 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                pointerEvents: 'none' // Let clicks pass through empty areas
            }}>
                {/* Search Bar */}
                <div style={{
                    pointerEvents: 'auto',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    gap: '12px'
                }}>
                    <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                        <ChevronLeft size={24} color="#333" />
                    </button>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', color: '#999' }}>
                        <Search size={20} />
                        <span style={{ fontSize: '15px' }}>{realRestaurants.length > 0 ? `${realRestaurants.length}곳의 맛집 발견` : "맛집 검색..."}</span>
                    </div>
                    <button style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                        <Menu size={24} color="#333" />
                    </button>
                </div>

                {/* Filter Chips */}
                <div style={{
                    pointerEvents: 'auto',
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    marginLeft: '-4px', paddingLeft: '4px', // Visual adjustment for shadow clipping
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    <button
                        onClick={() => setSelectedFilters([])}
                        style={{
                            flexShrink: 0,
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: selectedFilters.length === 0 ? 'none' : '1px solid #ddd',
                            background: selectedFilters.length === 0 ? '#333' : 'white',
                            color: selectedFilters.length === 0 ? 'white' : '#555',
                            fontSize: '13px',
                            fontWeight: 600,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        전체
                    </button>
                    {allergensList.map(allergen => (
                        <button
                            key={allergen.id}
                            onClick={() => toggleFilter(allergen.id)}
                            style={{
                                flexShrink: 0,
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: selectedFilters.includes(allergen.id) ? '1px solid var(--primary-color)' : 'none',
                                background: 'white',
                                color: selectedFilters.includes(allergen.id) ? 'var(--primary-color)' : '#555',
                                fontSize: '13px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            <span>{allergen.icon}</span>
                            <span>{allergen.name}안심</span>
                            {selectedFilters.includes(allergen.id) && <Check size={14} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- 2. Map Instance --- */}
            <Map
                center={state.center}
                isPanto={state.isPanto}
                style={{ width: "100%", height: "100%" }}
                level={4}
                onClick={() => setSelectedId(null)}
            >
                {/* User Location */}
                {myLocation && (
                    <MapMarker
                        position={myLocation}
                        image={{
                            src: 'https://cdn-icons-png.flaticon.com/512/7506/7506114.png',
                            size: { width: 44, height: 44 }
                        }}
                    />
                )}

                {/* Restaurants */}
                {filteredRestaurants.map((res) => {
                    const isSelected = res.id === selectedId;
                    return (
                        <MapMarker
                            key={res.id}
                            position={{ lat: res.position[0], lng: res.position[1] }}
                            onClick={() => setSelectedId(isSelected ? null : res.id)}
                            image={{
                                src: isSelected 
                                    ? 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png' // Larger on selection (simulated)
                                    : 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
                                size: isSelected ? { width: 48, height: 48 } : { width: 36, height: 36 }
                            }}
                        >
                            {/* Label Overlay for Selected Marker */}
                            {isSelected && (
                                <div style={{
                                    padding: '4px 8px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    marginBottom: '8px',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {res.name}
                                </div>
                            )}
                        </MapMarker>
                    );
                })}

                {/* Info Window (Custom Overlay) - Kept for fallback, but main info is now in Bottom Sheet/Card */}
            </Map>

            {/* --- 3. Floating Controls (Bottom) --- */}
            {/* My Location (Bottom-Left) */}
            <button
                onClick={moveToMyLocation}
                style={{
                    position: 'absolute',
                    bottom: selectedId ? '240px' : '100px', // Adjust based on sheet height
                    left: '16px',
                    zIndex: 20,
                    width: '44px', height: '44px',
                    borderRadius: '50%',
                    background: 'white',
                    border: '1px solid #eee',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'bottom 0.3s ease'
                }}
            >
                <Crosshair size={22} color={myLocation ? "var(--primary-color)" : "#666"} />
            </button>

            {/* List View (Bottom-Right) */}
            <button
                style={{
                    position: 'absolute',
                    bottom: selectedId ? '240px' : '100px', // Adjust based on sheet height
                    right: '16px',
                    zIndex: 20,
                    padding: '10px 16px',
                    borderRadius: '24px',
                    background: 'white',
                    border: '1px solid #eee',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer',
                    transition: 'bottom 0.3s ease'
                }}
            >
                <List size={18} color="#333" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>목록</span>
            </button>

            {/* --- 4. Bottom Sheet (Restaurant Info or Summary) --- */}
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                zIndex: 30,
                background: 'white',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
                transform: selectedId ? 'translateY(0)' : 'translateY(100%)', // Show only when selected for now, or maintain mini-sheet
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                paddingBottom: '20px' // Safe area
            }}>
                {/* Drag Handle */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    <div style={{ width: '40px', height: '4px', background: '#ddd', borderRadius: '2px' }} />
                </div>

                {/* Content */}
                {selectedId ? (
                    (() => {
                        const res = dataToDisplay.find(r => r.id === selectedId);
                        return (
                            <div onClick={() => navigate(`/restaurant/${selectedId}`)} style={{ padding: '0 20px 20px', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>{res?.name}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '14px' }}>
                                            <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{res?.rating}</span>
                                            <div style={{ display: 'flex' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < Math.floor(res?.rating || 0) ? "#FFD700" : "#ddd"} color="none" />
                                                ))}
                                            </div>
                                            <span>({res?.reviewCount})</span>
                                            <span>· {res?.distance}</span>
                                        </div>
                                    </div>
                                    <div style={{ 
                                        width: '40px', height: '40px', borderRadius: '50%', background: '#Ffeeec', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                    }}>
                                        <Check size={20} color="var(--primary-color)" />
                                    </div>
                                </div>
                                
                                {/* Info Box with Address if image is generic */}
                                <div style={{ marginTop: '8px', fontSize: '13px', color: '#888' }}>
                                    {res?.address || "주소 정보 없음"}
                                </div>

                                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {res?.safeFor?.map(safe => {
                                        const allergen = allergensList.find(a => a.id === safe);
                                        return allergen && (
                                            <span key={safe} style={{ 
                                                fontSize: '12px', background: '#f5f5f5', color: '#555', 
                                                padding: '6px 10px', borderRadius: '8px', whiteSpace: 'nowrap' 
                                            }}>
                                                {allergen.icon} {allergen.name}안심
                                            </span>
                                        );
                                    })}
                                </div>

                                <button style={{
                                    marginTop: '20px', width: '100%', padding: '14px',
                                    background: 'var(--primary-color)', color: 'white',
                                    border: 'none', borderRadius: '12px',
                                    fontSize: '15px', fontWeight: 600, cursor: 'pointer'
                                }}>
                                    상세보기 및 예약하기
                                </button>
                            </div>
                        );
                    })()
                ) : (
                    // Default State (When nothing selected) - Mini Sheet
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                         <p>지도를 움직여 안심 식당을 찾아보세요</p>
                    </div>
                )}
            </div>
            
            {/* Show simple banner when nothing selected to mimic reference "Nearby" */}
            {!selectedId && (
                 <div style={{
                    position: 'absolute',
                    bottom: '80px', // Above nav
                    left: 0, right: 0,
                    background: 'white',
                    borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
                    boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
                    padding: '20px',
                    zIndex: 25
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{ fontSize: '16px', fontWeight: 700 }}>주변 1km</span>
                            <span style={{ marginLeft: '8px', color: 'var(--primary-color)', fontWeight: 600 }}>{filteredRestaurants.length}곳</span>
                            <span style={{ marginLeft: '4px', color: '#888' }}>검색됨</span>
                        </div>
                        <ChevronLeft style={{ transform: 'rotate(-90deg)', color: '#ccc' }} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default MapView

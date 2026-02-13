import React, { useState, useEffect } from 'react'
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk'
import { ChevronLeft, Star, Crosshair, Check } from 'lucide-react'
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
    const [selectedFilters, setSelectedFilters] = useState([]); // Array of allergen IDs

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
                    setState({ center: newPos, isPanto: true }); // Smooth move to user
                },
                (err) => {
                    console.error("Geolocation failed:", err);
                    // Optional: Show toast or alert
                }
            );
        }
    }, []);

    const moveToMyLocation = () => {
        if (myLocation) {
            setState({ center: myLocation, isPanto: true });
        } else {
            alert("현재 위치를 가져올 수 없습니다.");
        }
    };

    const toggleFilter = (id) => {
        setSelectedFilters(prev => 
            prev.includes(id) 
                ? prev.filter(f => f !== id) 
                : [...prev, id]
        );
        setSelectedId(null); // Close info window when filtering
    };

    // Filter Logic: Show restaurant IF it is safe for ALL selected filters
    const filteredRestaurants = restaurants.filter(res => {
        if (selectedFilters.length === 0) return true;
        // Check if restaurant is safe for ALL selected allergens
        // res.safeFor must include EVERY item in selectedFilters
        return selectedFilters.every(filterId => res.safeFor.includes(filterId));
    });

    if (sdkLoading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>지도를 불러오는 중...</div>;
    if (sdkError) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>지도 로딩 중 오류가 발생했습니다.</div>;

    return (
        <div className="map-page" style={{ height: '100vh', width: '100%', position: 'relative' }}>
            {/* 1. Header */}
            <header style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 20,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0))',
                pointerEvents: 'none' // Allow clicks to pass through transparent parts
            }}>
                <button onClick={() => navigate(-1)} style={{ 
                    pointerEvents: 'auto', border: 'none', background: 'white', 
                    borderRadius: '50%', width: '40px', height: '40px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <ChevronLeft size={24} color="#333" />
                </button>
                
                {/* Horizontal Scroll Filters */}
                <div style={{ 
                    pointerEvents: 'auto', 
                    flex: 1, 
                    display: 'flex', 
                    gap: '8px', 
                    overflowX: 'auto', 
                    padding: '4px 0',
                    scrollbarWidth: 'none', // Hide scrollbar
                    msOverflowStyle: 'none'
                }}>
                    {allergensList.map(allergen => (
                        <button
                            key={allergen.id}
                            onClick={() => toggleFilter(allergen.id)}
                            style={{
                                flexShrink: 0,
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: `1px solid ${selectedFilters.includes(allergen.id) ? 'var(--primary-color)' : '#ddd'}`,
                                background: selectedFilters.includes(allergen.id) ? 'var(--primary-color)' : 'white',
                                color: selectedFilters.includes(allergen.id) ? 'white' : '#555',
                                fontSize: '13px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <span>{allergen.icon}</span>
                            <span>{allergen.name}</span>
                            {selectedFilters.includes(allergen.id) && <Check size={12} strokeWidth={3} />}
                        </button>
                    ))}
                </div>
            </header>

            {/* 2. Map Instance */}
            <Map
                center={state.center}
                isPanto={state.isPanto}
                style={{ width: "100%", height: "100%" }}
                level={4}
                onClick={() => setSelectedId(null)}
            >
                {/* User Location Marker */}
                {myLocation && (
                    <MapMarker
                        position={myLocation}
                        image={{
                            src: 'https://cdn-icons-png.flaticon.com/512/7506/7506114.png', // Blue dot style
                            size: { width: 44, height: 44 }
                        }}
                        title="내 위치"
                    />
                )}

                {/* Restaurant Markers */}
                {filteredRestaurants.map((res) => (
                    <MapMarker
                        key={res.id}
                        position={{ lat: res.position[0], lng: res.position[1] }}
                        onClick={() => setSelectedId(res.id === selectedId ? null : res.id)}
                        image={{
                            src: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
                            size: { width: 36, height: 36 }
                        }}
                    />
                ))}

                {/* Info Window (Custom Overlay) */}
                {selectedId && (
                    <CustomOverlayMap
                        position={{
                            lat: restaurants.find(r => r.id === selectedId).position[0],
                            lng: restaurants.find(r => r.id === selectedId).position[1]
                        }}
                        yAnchor={1.4}
                    >
                        <div onClick={() => navigate(`/restaurant/${selectedId}`)} style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            width: '240px',
                            display: 'flex',
                            gap: '12px',
                            cursor: 'pointer',
                            position: 'relative',
                            animation: 'fadeInUp 0.2s ease-out'
                        }}>
                            <img
                                src={restaurants.find(r => r.id === selectedId).image}
                                alt=""
                                style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a1a' }}>
                                    {restaurants.find(r => r.id === selectedId).name}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#666' }}>
                                    <Star size={14} fill="#FFD700" color="#FFD700" />
                                    <span style={{ fontWeight: 600, color: '#333' }}>{restaurants.find(r => r.id === selectedId).rating}</span>
                                    <span>· {restaurants.find(r => r.id === selectedId).type}</span>
                                </div>
                                <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                                    {restaurants.find(r => r.id === selectedId).safeFor.slice(0, 3).map(safe => {
                                        const allergen = allergensList.find(a => a.id === safe);
                                        return allergen && (
                                            <span key={safe} style={{ fontSize: '11px', background: '#f0fdf4', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>
                                                {allergen.name}안심
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </CustomOverlayMap>
                )}
            </Map>

            {/* 3. My Location Button */}
            <button 
                onClick={moveToMyLocation}
                style={{
                    position: 'absolute',
                    bottom: '100px', // Above bottom nav
                    right: '20px',
                    zIndex: 20,
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                <Crosshair size={24} color={myLocation ? "var(--primary-color)" : "#999"} />
            </button>
        </div>
    )
}

export default MapView

import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk'
import { ChevronLeft, Info, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const MapView = ({ restaurants = [] }) => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);
    const center = { lat: 37.5665, lng: 126.9780 }; // Seoul City Hall

    // Modern SDK loading without parser-blocking warnings
    const { loading: sdkLoading, error: sdkError } = useKakaoLoader({
        appkey: "6758187da106ac91415a4fc813c1edde",
        libraries: ["services", "clusterer"],
    });

    if (sdkLoading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>지도를 불러오는 중...</div>;
    if (sdkError) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>지도 로딩 중 오류가 발생했습니다.</div>;

    return (
        <div className="map-page" style={{ height: '100vh', width: '100%', position: 'relative' }}>
            {/* 1. Map Header */}
            <header style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
                    <ChevronLeft size={24} />
                </button>
                <h1 style={{ fontSize: '18px', fontWeight: 600 }}>내 주변 안심 존 📍</h1>
            </header>

            {/* 2. Map Instance */}
            <Map
                center={center}
                style={{ width: "100%", height: "100%" }}
                level={4}
            >
                {restaurants.map((res) => (
                    <MapMarker
                        key={res.id}
                        position={{ lat: res.position[0], lng: res.position[1] }}
                        onClick={() => setSelectedId(res.id === selectedId ? null : res.id)}
                        image={{
                            src: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png', // Custom marker icon
                            size: { width: 32, height: 32 }
                        }}
                    />
                ))}

                {/* 3. Info Window (Custom Overlay) */}
                {selectedId && (
                    <CustomOverlayMap
                        position={{
                            lat: restaurants.find(r => r.id === selectedId).position[0],
                            lng: restaurants.find(r => r.id === selectedId).position[1]
                        }}
                        yAnchor={1.2}
                    >
                        <div onClick={() => navigate(`/restaurant/${selectedId}`)} style={{
                            background: 'white',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            minWidth: '200px',
                            display: 'flex',
                            gap: '12px',
                            cursor: 'pointer',
                            border: '1px solid var(--primary-color)'
                        }}>
                            <img
                                src={restaurants.find(r => r.id === selectedId).image}
                                alt=""
                                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                                <h3 style={{ fontSize: '14px', margin: '0 0 4px' }}>{restaurants.find(r => r.id === selectedId).name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <Star size={12} fill="var(--warning-yellow)" color="var(--warning-yellow)" />
                                    <span>{restaurants.find(r => r.id === selectedId).rating}</span>
                                    <span>· {restaurants.find(r => r.id === selectedId).type}</span>
                                </div>
                            </div>
                        </div>
                    </CustomOverlayMap>
                )}
            </Map>

            {/* 4. Bottom Floating Toggle (Filters placeholder) */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                background: 'white',
                padding: '8px 20px',
                borderRadius: '30px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
            }}>
                <span>#땅콩안심</span>
                <span style={{ opacity: 0.2 }}>|</span>
                <span>#계란안심</span>
            </div>
        </div>
    )
}

export default MapView

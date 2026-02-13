import React from 'react';
import { Camera, Image, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScanPage = () => {
    const navigate = useNavigate();

    return (
        <div className="scan-page-container" style={{ 
            height: '100dvh', 
            backgroundColor: '#000', 
            color: 'white',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative'
        }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '8px',
                    cursor: 'pointer',
                    color: 'white'
                }}
            >
                <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ marginBottom: '10px' }}>성분표를 찍어보세요</h2>
                <p style={{ color: '#ccc', fontSize: '14px' }}>알러지 유발 성분을 자동으로 분석해드려요</p>
            </div>

            <div style={{ 
                width: '80%', 
                aspectRatio: '1/1', 
                border: '2px dashed rgba(255,255,255,0.5)', 
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px'
            }}>
                <Camera size={48} color="rgba(255,255,255,0.5)" />
            </div>

            <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: 'white',
                        border: '4px solid rgba(255,255,255,0.3)',
                        cursor: 'pointer'
                    }}></div>
                    <span style={{ fontSize: '12px' }}>촬영</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        <Image size={24} />
                    </div>
                    <span style={{ fontSize: '12px' }}>앨범</span>
                </div>
            </div>
        </div>
    );
};

export default ScanPage;

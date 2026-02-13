import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Image as ImageIcon, X, Zap, RefreshCw, ChevronLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allergensList } from './data';

const ScanPage = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const [selectedAllergens, setSelectedAllergens] = useState([]);

    // Capture from Webcam
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    // Handle File Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Toggle Camera
    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    // Toggle Allergen Filter
    const toggleAllergen = (id) => {
        setSelectedAllergens(prev => 
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    // Reset
    const handleRetake = () => {
        setImgSrc(null);
        setResult(null);
        setError(null);
        setSelectedAllergens([]);
    };

    // API Call
    const handleAnalyze = async () => {
        if (!imgSrc) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // Document says: "The API accepts image and audio inputs in Base64-encoded format."
            // Py example uses raw base64 string.
            // imgSrc is "data:image/jpeg;base64,....". We need to strip the prefix.
            const base64Image = imgSrc.split(',')[1];

            // Construct Prompt based on selected allergens
            let promptText = "이 음식 사진을 분석해서 1. 메뉴 이름, 2. 주요 재료, 3. 알레르기 유발 가능 성분을 알려줘. 응답은 반드시 JSON 형식으로 해줘. 예시: {\"menu\": \"이름\", \"ingredients\": [\"재료1\", \"재료2\"], \"allergens\": [\"알러지1\"]}";
            
            if (selectedAllergens.length > 0) {
                const selectedNames = selectedAllergens.map(id => allergensList.find(a => a.id === id)?.name).join(', ');
                promptText += `\n특히 다음 알레르기 성분이 포함되어 있는지 **중점적으로 확인**해줘: [${selectedNames}]. 만약 해당 성분이 조금이라도 의심되면 allergens 리스트에 반드시 포함시켜줘.`;
            }

            // Call our Cloudflare Function proxy (or local proxy via Vite)
            const response = await fetch('/api/analyze', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "kanana-o",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "image_url", image_url: { url: base64Image } },
                                { type: "text", text: promptText }
                            ]
                        }
                    ],
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            setResult(content);

        } catch (err) {
            console.error("Analysis Failed:", err);
            setError(`분석 실패: ${err.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Helper to format result text (simplistic JSON parser or text renderer)
    const renderResult = () => {
        if (!result) return null;
        
        let parsedData = null;
        try {
             // Try to find JSON block
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
            } else {
                parsedData = JSON.parse(result);
            }
        } catch (e) {
            // Text fallback
            return (
                 <div className="analysis-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(10px)', width: '100%' }}>
                    <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#FF4F28' }}>분석 결과</h3>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5' }}>{result}</div>
                </div>
            );
        }

        // Highlight detected allergens that match selected filter
        const safetyCheck = selectedAllergens.every(id => 
            !parsedData.allergens?.some(a => a.includes(allergensList.find(al => al.id === id)?.name))
        );

        return (
            <div className="analysis-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(10px)', width: '100%' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '20px', color: '#FF4F28' }}>{parsedData.menu || "음식 분석 결과"}</h3>
                
                {selectedAllergens.length > 0 && (
                    <div style={{ marginBottom: '15px', padding: '10px', borderRadius: '8px', background: safetyCheck ? 'rgba(0,177,106,0.2)' : 'rgba(255,79,40,0.2)', border: `1px solid ${safetyCheck ? '#00B16A' : '#FF4F28'}` }}>
                         <h4 style={{ fontSize: '14px', margin: '0 0 4px', color: safetyCheck ? '#00B16A' : '#FF4F28', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {safetyCheck ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                            {safetyCheck ? "선택한 알레르기 성분 안심" : "선택한 알레르기 성분 감지됨!"}
                         </h4>
                         <p style={{ fontSize: '12px', margin: 0, color: 'white' }}>
                            {safetyCheck 
                                ? "분석 결과, 선택하신 알레르기 유발 성분이 발견되지 않았습니다." 
                                : "주의하세요! 음식이 선택하신 알레르기 성분을 포함하고 있을 수 있습니다."}
                         </p>
                    </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>주요 재료</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {parsedData.ingredients?.map((ing, i) => (
                            <span key={i} style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>{ing}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>⚠️ 알레르기 주의</h4>
                    {parsedData.allergens?.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {parsedData.allergens.map((alg, i) => (
                                <span key={i} style={{ background: 'rgba(255, 79, 40, 0.2)', color: '#FF4F28', border: '1px solid #FF4F28', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>{alg}</span>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00B16A' }}>
                            <CheckCircle size={16} />
                            <span>감지된 알레르기 성분이 없습니다.</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="scan-page-container" style={{ 
            height: '100dvh', 
            backgroundColor: '#000', 
            color: 'white',
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{ 
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, 
                padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'
            }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ChevronLeft size={28} />
                </button>
                <span style={{ fontWeight: 600 }}>Food Lens</span>
                <div style={{ width: '28px' }}></div> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%' }}>
                
                {imgSrc ? (
                    // Image Preview & Result
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
                        <div style={{ 
                            position: 'relative', 
                            width: '100%', 
                            maxHeight: result ? '40vh' : '60vh', 
                            borderRadius: '20px', 
                            overflow: 'hidden', 
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            transition: 'all 0.3s ease'
                        }}>
                            <img src={imgSrc} alt="capture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {isAnalyzing && (
                                <div style={{ 
                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', 
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <div className="spinner" style={{ 
                                        width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', 
                                        borderTopColor: '#FF4F28', borderRadius: '50%', animation: 'spin 1s linear infinite' 
                                    }}></div>
                                    <p style={{ marginTop: '16px', fontWeight: 500 }}>AI가 분석중입니다...</p>
                                </div>
                            )}
                        </div>

                        {/* Result Display */}
                        {result && (
                            <div style={{ marginTop: '20px', width: '100%', animation: 'slideUp 0.3s ease-out' }}>
                                {renderResult()}
                            </div>
                        )}
                        
                        {/* Error Display */}
                        {error && (
                            <div style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'rgba(255, 59, 48, 0.15)', border: '1px solid #FF3B30', borderRadius: '8px', color: '#FF3B30', fontSize: '13px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <AlertTriangle size={16} />
                                    <strong>오류 발생</strong>
                                </div>
                                {error}
                            </div>
                        )}

                        {/* Filter Selection (only when not analyzing and no result) */}
                        {!isAnalyzing && !result && (
                            <div style={{ marginTop: 'auto', marginBottom: '20px', width: '100%' }}>
                                <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '10px', textAlign: 'center' }}>
                                    확인하고 싶은 알러지 성분을 선택하세요
                                </p>
                                <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 4px' }}>
                                    {allergensList.map(allergen => {
                                        const isSelected = selectedAllergens.includes(allergen.id);
                                        return (
                                            <button 
                                                key={allergen.id} 
                                                onClick={() => toggleAllergen(allergen.id)}
                                                style={{
                                                    background: isSelected ? 'var(--primary-color)' : 'rgba(255,255,255,0.15)',
                                                    color: 'white',
                                                    border: isSelected ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '20px',
                                                    padding: '8px 16px',
                                                    fontSize: '13px',
                                                    whiteSpace: 'nowrap',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {allergen.icon} {allergen.name}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {!isAnalyzing && (
                            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', width: '100%' }}>
                                <button onClick={handleRetake} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#333', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                                    다시 찍기
                                </button>
                                {!result && (
                                    <button onClick={handleAnalyze} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#FF4F28', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Zap size={18} fill="white" /> 분석하기
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    // Camera View
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode }}
                            style={{ 
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' 
                            }}
                        />
                        
                        {/* Overlay Controls */}
                        <div style={{ 
                            position: 'absolute', bottom: 0, left: 0, right: 0, 
                            padding: '40px 20px 60px', 
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                            zIndex: 20 
                        }}>
                            {/* Gallery */}
                            <div onClick={() => {
                                console.log("Album clicked");
                                if (fileInputRef.current) fileInputRef.current.click();
                            }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ImageIcon size={24} />
                                </div>
                                <span style={{ fontSize: '12px' }}>앨범</span>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none' }} 
                            />

                            {/* Shutter */}
                            <div onClick={capture} style={{ 
                                width: '72px', height: '72px', borderRadius: '50%', background: 'white',
                                border: '4px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #000' }}></div>
                            </div>

                            {/* Rotate */}
                            <div onClick={toggleCamera} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <RefreshCw size={24} />
                                </div>
                                <span style={{ fontSize: '12px' }}>전환</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default ScanPage;

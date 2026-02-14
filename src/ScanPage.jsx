import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Image as ImageIcon, X, Zap, RefreshCw, ChevronLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allergensList } from './data';

const ScanPage = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // State
    const [imgSrc, setImgSrc] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState("environment");
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
        setResult(null); // Clear previous result

        try {
            const base64Image = imgSrc; // Tesseract accepts data URI directly
            let ocrText = "";
            let isTextMode = false;

            // 1. Try OCR First (Tesseract.js - Client Side & Free)
            try {
                // Determine language based on browser or default to Korean+English
                const { data: { text } } = await Tesseract.recognize(
                    base64Image,
                    'kor+eng', 
                    { 
                        logger: m => console.log(m) // Optional logger
                    }
                );
                
                if (text && text.trim().length > 0) {
                    ocrText = text;
                    // Router Logic: If significant text detected (> 20 chars), use Text Mode
                    // Clean up newlines for better length check
                    const cleanText = text.replace(/\s+/g, '').trim();
                    if (cleanText.length > 20) {
                        isTextMode = true;
                    }
                }
            } catch (ocrErr) {
                console.warn("OCR Failed, falling back to Visual Analysis", ocrErr);
            }

            // 2. Branching Logic
            if (isTextMode) {
                // --- Text Mode (Ingredients Analysis) ---
                console.log("Text Mode Activated", ocrText);
                
                // Simple keyword matching for allergens
                const detectedAllergens = [];
                const allergenKeywords = {
                    'egg': ['계란', '달걀', '난백', '난황', '알가공품'],
                    'dairy': ['우유', '치즈', '버터', '크림', '유당', '분유', '유청'],
                    'peanut': ['땅콩', '피넛'],
                    'wheat': ['밀', '글루텐', '소맥', '호밀'],
                    'soy': ['대두', '콩', '두부', '두유', '레시틴'],
                    'shellfish': ['새우', '게', '랍스터', '굴', '조개', '홍합', '전복'],
                };

                for (const [key, keywords] of Object.entries(allergenKeywords)) {
                    if (keywords.some(k => ocrText.includes(k))) {
                        // Map back to our display names
                        const displayName = allergensList.find(a => a.id === key)?.name || key;
                        detectedAllergens.push(displayName);
                    }
                }
                
                // Construct a result object similar to API response
                const resultObj = {
                    menu: "성분표/텍스트 분석 결과",
                    ingredients: ["이미지 내 텍스트에서 추출"],
                    allergens: detectedAllergens,
                    risk_score: detectedAllergens.length > 0 ? 80 : 10,
                    raw_text: ocrText // Store for display
                };
                
                setResult(JSON.stringify(resultObj)); // Store using same state

            } else {
                // --- Image Mode (Kanana-o Visual Analysis) ---
                console.log("Image Mode Activated");

                const base64Content = imgSrc.split(',')[1];

                // Construct Prompt based on selected allergens
                let promptText = "이 음식 사진을 분석해서 다음 정보를 JSON 포맷으로 정리해줘.\n\n" +
                    "{\n" +
                    "  \"menu\": \"추정되는 메뉴 이름\",\n" +
                    "  \"ingredients\": [\"주요 재료1\", \"주요 재료2\"],\n" +
                    "  \"allergens\": [\"발견된 알레르기 성분1\", \"발견된 알레르기 성분2\"],\n" +
                    "  \"risk_score\": 0~100 사이의 위험도 숫자 (0: 안전, 100: 매우 위험)\n" +
                    "}\n\n" +
                    "**주의사항:**\n" +
                    "1. 앞뒤에 사족이나 설명 없이 **오직 JSON 코드만** 출력해.\n" +
                    "2. 알레르기 성분은 [계란, 우유, 땅콩, 견과류, 밀, 대두, 갑각류, 생선] 중에서 식별해줘.\n";
                
                if (selectedAllergens.length > 0) {
                    const selectedNames = selectedAllergens.map(id => allergensList.find(a => a.id === id)?.name).join(', ');
                    promptText += `3. 특히 사용자에게 [${selectedNames}] 알러지가 있어. 이 성분이 포함될 가능성이 있다면 'allergens'에 반드시 포함하고 'risk_score'를 높게 잡아줘.`;
                }

                // Call Cloudflare Function proxy
                const response = await fetch('/api/analyze', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "kanana-o",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    { type: "image_url", image_url: { url: base64Content } },
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
            }

        } catch (err) {
            console.error("Analysis Failed:", err);
            setError(`분석 실패: ${err.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Helper to format result text
    const renderResult = () => {
        if (!result) return null;
        
        let parsedData = null;
        try {
             // Try to find JSON block first
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
            } else {
                parsedData = JSON.parse(result);
            }
        } catch (e) {
            console.error("JSON Parse Error:", e);
        }

        // Fallback for failed parsing (Text Mode)
        if (!parsedData) {
             return (
                 <div className="analysis-card" style={{ background: 'rgba(20,20,20,0.9)', padding: '24px', borderRadius: '24px', border: '1px solid #333', width: '90%', margin: '0 auto' }}>
                     <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--danger-red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={18} /> 분석 결과 (텍스트)
                    </h3>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6', color: '#eee' }}>{result}</div>
                </div>
            );
        }

        // --- Visualization Logic ---
        
        // 1. Synonyms for better matching
        const allergenAliases = {
            'dairy': ['우유', '치즈', '버터', '크림', '요거트', '유제품', 'milk', 'cheese'],
            'egg': ['계란', '달걀', '난류', 'egg'],
            'peanut': ['땅콩', 'peanut'],
            'wheat': ['밀', '글루텐', 'wheat', 'bread', 'flour'],
            'soy': ['대두', '콩', '두유', '두부', 'soy'],
            'shellfish': ['갑각류', '새우', '게', '랍스터', '조개', 'shellfish', 'shrimp', 'crab']
        };

        // 2. Check Specific Selected Allergens
        const userRiskDetails = selectedAllergens.map(id => {
            const allergenName = allergensList.find(a => a.id === id)?.name;
            const aliases = allergenAliases[id] || [allergenName];
            
            // Check if any alias is present in the detected allergens list (string matching)
            const isDetected = parsedData.allergens?.some(detectedItem => 
                aliases.some(alias => detectedItem.includes(alias))
            );
            
            return { id, name: allergenName, detected: isDetected };
        });

        const hasDetectedSelected = userRiskDetails.some(r => r.detected);
        const riskScore = parsedData.risk_score || (hasDetectedSelected ? 90 : 10);
        
        let riskColor = '#00B16A'; // Green
        let riskLabel = '안심';
        if (riskScore >= 70) {
            riskColor = 'var(--danger-red)'; // Red
            riskLabel = '위험';
        } else if (riskScore >= 40) {
            riskColor = '#FFB900'; // Yellow
            riskLabel = '주의';
        }

        return (
            <div className="analysis-card" style={{ 
                background: 'rgba(20,20,20,0.95)', 
                padding: '24px', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                width: '90%', 
                margin: '0 auto 40px', // Add bottom margin for scrolling
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 700, color: 'white', textAlign: 'center' }}>
                    {parsedData.menu || "음식 분석 결과"}
                </h3>

                {/* Compact Risk Meter (Horizontal Bar) */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#ccc' }}>위험도</span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '24px', fontWeight: 800, color: riskColor, marginRight: '6px' }}>{riskScore}</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: riskColor, padding: '2px 8px', borderRadius: '12px', background: `${riskColor}20` }}>
                                {riskLabel} 단계
                            </span>
                        </div>
                    </div>
                    {/* Progress Bar Track */}
                    <div style={{ width: '100%', height: '12px', background: '#333', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                        {/* Progress Bar Fill */}
                        <div style={{ 
                            width: `${riskScore}%`, 
                            height: '100%', 
                            background: `linear-gradient(90deg, ${riskColor}, ${riskColor})`,
                            borderRadius: '6px',
                            transition: 'width 1s ease-out'
                        }}></div>
                    </div>
                </div>

                {/* Selected Allergen Check */}
                {selectedAllergens.length > 0 && (
                    <div style={{ marginBottom: '20px', background: '#252525', padding: '16px', borderRadius: '16px' }}>
                        <h4 style={{ fontSize: '13px', color: '#aaa', margin: '0 0 10px' }}>선택한 알러지 체크</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {userRiskDetails.map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: 'white' }}>{item.name}</span>
                                    {item.detected ? (
                                        <span style={{ color: 'var(--danger-red)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertTriangle size={14}/> 감지됨
                                        </span>
                                    ) : (
                                        <span style={{ color: '#00B16A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle size={14}/> 불검출
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ingredients & Allergens List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <h4 style={{ fontSize: '13px', color: '#aaa', margin: '0 0 8px' }}>주요 재료</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {parsedData.ingredients?.map((ing, i) => (
                                <span key={i} style={{ background: '#333', color: '#eee', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>{ing}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '13px', color: '#aaa', margin: '0 0 8px' }}>발견된 알레르기 성분</h4>
                         {parsedData.allergens?.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {parsedData.allergens.map((alg, i) => (
                                    <span key={i} style={{ background: 'rgba(255, 59, 48, 0.15)', color: 'var(--danger-red)', border: '1px solid rgba(255, 59, 48, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>{alg}</span>
                                ))}
                            </div>
                        ) : (
                            <span style={{ fontSize: '13px', color: '#aaa' }}>특이사항 없음</span>
                        )}
                    </div>
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
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)'
            }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ChevronLeft size={28} />
                </button>
                <span style={{ fontWeight: 600 }}>Food Lens</span>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            {/* Main Content (Scrollable) */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                position: 'relative', 
                width: '100%',
                overflowY: 'auto', // Enable vertical scrolling
                paddingTop: '60px' // Space for header
            }}>
                
                {imgSrc ? (
                    // Image Preview & Result
                    <div style={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
                        <div style={{ 
                            position: 'relative', 
                            width: '100%', 
                            height: 'auto',
                            maxHeight: '50vh', // Limit image height
                            borderRadius: '20px', 
                            overflow: 'hidden', 
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            transition: 'all 0.3s ease',
                            flexShrink: 0 // Prevent image from squishing
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
                                        borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' 
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
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', padding: '0 4px' }}>
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
                                    <button onClick={handleAnalyze} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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

import React, { useState } from 'react';
import { ShieldCheck, RotateCw, QrCode, Phone, Languages } from 'lucide-react';
import { allergensList } from './data';
import './index.css';

const AllergyCard = ({ user = { name: "김라연", birthDate: "2001.03.22" }, allergies = ['shrimp', 'crab', 'peanut'], customMessage }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentLang, setCurrentLang] = useState('KO'); // KO, EN, JA, ZH
  const [translatedContent, setTranslatedContent] = useState(null);

  const selectedAllergens = allergensList.filter(a => allergies.includes(a.id));

  const handleTranslate = async () => {
    const nextLangMap = { 'KO': 'EN', 'EN': 'JA', 'JA': 'ZH', 'ZH': 'KO' };
    const nextLang = nextLangMap[currentLang];
    setCurrentLang(nextLang);

    if (nextLang === 'KO') {
        setTranslatedContent(null);
        return;
    }

    // Mock Translation Data for Demo (simulating Google Translate API)
    // In production, use: https://translation.googleapis.com/language/translate/v2
    const mockTranslations = {
        'EN': "Excuse me,\nI have <span style='color: var(--primary-color)'>severe food allergies</span>.\n<span style='font-size:15px; color:#666; font-weight:400; display:block; margin-top:8px'>Please help me check the ingredients carefully.</span>",
        'JA': "すみません、\n私は<span style='color: var(--primary-color)'>重度の食物アレルギー</span>が\nあります。\n<span style='font-size:15px; color:#666; font-weight:400; display:block; margin-top:8px'>原材料の確認をお願いします。</span>",
        'ZH': "不好意思，\n我有<span style='color: var(--primary-color)'>严重的食物过敏</span>。\n<span style='font-size:15px; color:#666; font-weight:400; display:block; margin-top:8px'>请帮我确认一下成分。</span>"
    };

    // If custom message matches default, use mock. Otherwise, we'd call API.
    // For this prototype, we'll just try to match the defaults or provide a generic translation.
    setTranslatedContent(mockTranslations[nextLang] || "Translation requires API Key");
  };
// ... (rest of component)
// inside return > back-side:
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#333', marginBottom: '8px', lineHeight: 1.3 }}>
                {customMessage ? (
                    <span dangerouslySetInnerHTML={{ __html: customMessage.replace(/\n/g, '<br/>') }} />
                ) : (
                    <>
                        죄송하지만,<br/>저는 <span style={{ color: 'var(--primary-color)' }}>심각한 알러지</span>가<br/>있습니다.
                    </>
                )}
            </h2>

  return (
    <div style={{ perspective: '1000px', cursor: 'pointer', margin: '20px auto', width: '320px', height: '500px' }} onClick={() => setIsFlipped(!isFlipped)}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        
        {/* --- FRONT SIDE --- */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FFF0ED 0%, #FFFBE6 100%)', // Pastel Warm Hybrid
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
             <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '24px', height: '24px' }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>알러지 알림 카드</span>
             </div>
             <ShieldCheck size={20} color="var(--safe-green)" />
          </div>

          {/* Character */}
          <div style={{ margin: '20px 0', position:'relative' }}>
             <div style={{ 
                 width: '140px', height: '140px', borderRadius: '50%', backgroundColor: '#FFE082',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px'
             }}>
                 🐻
             </div>
             {/* Decor */}
             <div style={{ position:'absolute', bottom:0, right:0, background:'var(--primary-color)', color:'white', padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:700 }}>
                Level 2
             </div>
          </div>

          {/* User Info */}
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#333', margin: '0 0 4px 0' }}>{user.name}</h2>
          <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>{user.birthDate}</p>

          <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.05)', margin: '20px 0' }}></div>

          {/* Allergen Icons */}
          <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>주의해야 할 알러지</h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {selectedAllergens.map(allergen => (
                <div key={allergen.id} style={{ 
                    display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
                    background: 'white', padding: '10px', borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', minWidth: '60px'
                }}>
                    <span style={{ fontSize: '24px' }}>{allergen.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>{allergen.name}</span>
                </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', fontSize: '12px', color: '#aaa', display:'flex', alignItems:'center', gap:'4px' }}>
            <RotateCw size={12} />
            탭하여 뒷면 보기
          </div>
        </div>


        {/* --- BACK SIDE (Staff View) --- */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '24px',
          background: 'white',
          border: '4px solid var(--primary-color)', // Warning Border
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', padding: '24px', boxSizing: 'border-box',
          textAlign: 'left'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ 
                    background: 'var(--primary-color)', color: 'white', padding: '8px 16px', 
                    borderRadius: '20px', fontSize: '14px', fontWeight: 700
                }}>
                    NOTICE
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleTranslate(); }} style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', 
                    background: '#f5f5f5', padding: '6px 12px', borderRadius: '16px',
                    cursor: 'pointer', transition: 'all 0.2s'
                }}>
                    <Languages size={16} color="#666" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>
                        {currentLang === 'KO' ? 'Translate' : currentLang}
                    </span>
                </div>
            </div>

            {/* Notice Message Area */}
            <div style={{ marginBottom: '24px' }}>
                {translatedContent || customMessage ? (
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#333', lineHeight: 1.3, wordBreak: 'keep-all' }} 
                         dangerouslySetInnerHTML={{ __html: (translatedContent || customMessage).replace(/\n/g, '<br/>') }} />
                ) : (
                    <>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#333', marginBottom: '8px', lineHeight: 1.3, margin: 0 }}>
                            죄송하지만,<br/>저는 <span style={{ color: 'var(--primary-color)' }}>심각한 알러지</span>가<br/>있습니다.
                        </h2>
                        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.5, margin: '8px 0 0 0' }}>
                            Excuse me, I have severe food allergies. Please help me check the ingredients.
                        </p>
                    </>
                )}
            </div>

            <div style={{ background: '#FFF0ED', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-color)', fontWeight: 700 }}>
                    <ShieldCheck size={18} />
                    <span>절대 먹으면 안돼요! (No!)</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedAllergens.map(a => (
                        <span key={a.id} style={{ 
                            background: 'white', padding: '6px 10px', borderRadius: '8px', 
                            fontSize: '14px', fontWeight: 600, border: '1px solid #ffccc7',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                            {a.icon} {a.name} ({a.activeName || a.name})
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer removed per user request */}
            {/*
            <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Emergency Contact</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: 700, color: '#333' }}>
                            <Phone size={16} fill="#333" /> 010-1234-5678
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                         <QrCode size={48} color="#333" />
                         <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>Medical Info</div>
                    </div>
                </div>
            </div>
            */}

        </div>

      </div>
    </div>
  );
};

export default AllergyCard;

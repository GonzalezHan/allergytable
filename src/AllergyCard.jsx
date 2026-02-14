import React, { useState } from 'react';
import { ShieldCheck, RotateCw, QrCode, Phone, Languages, ChevronDown, Check } from 'lucide-react';
import { allergensList } from './data';
import './index.css';

const AllergyCard = ({ user = { name: "김라연", birthDate: "2001.03.22" }, allergies = ['shrimp', 'crab', 'peanut'], customMessage }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentLang, setCurrentLang] = useState('KO'); // KO, EN, JA, ZH
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const selectedAllergens = allergensList.filter(a => allergies.includes(a.id));

  const languages = [
    { code: 'KO', label: '한국어', icon: '🇰🇷' },
    { code: 'EN', label: 'English', icon: '🇺🇸' },
    { code: 'JA', label: '日本語', icon: '🇯🇵' },
    { code: 'ZH', label: '中文', icon: '🇨🇳' },
  ];

  const handleLanguageSelect = (langCode) => {
    setCurrentLang(langCode);
    setIsLangMenuOpen(false);
  };

  // Translations for static UI elements
  const uiTranslations = {
    'KO': {
        notice: "NOTICE",
        warningTitle: "절대 먹으면 안돼요! (No!)",
        flipHint: "탭하여 뒷면 보기"
    },
    'EN': {
        notice: "NOTICE",
        warningTitle: "Absolutely do not eat! (No!)",
        flipHint: "Tap to flip"
    },
    'JA': {
        notice: "NOTICE",
        warningTitle: "絶対に食べられません！(No!)",
        flipHint: "タップして裏面へ"
    },
    'ZH': {
        notice: "NOTICE",
        warningTitle: "绝对不能吃！(No!)",
        flipHint: "点击翻转"
    }
  };

  const getTranslatedMessage = () => {
      // 1. If it's the default Korean message, return the corresponding pre-defined translation
      const defaultKorean = "죄송하지만,\n저는 <span style='color: var(--primary-color)'>심각한 알러지</span>가\n있습니다.";
      
      // Simple check if customMessage contains the core Korean phrase (to identify default message)
      if (!customMessage || customMessage.includes("심각한 알러지")) {
          switch (currentLang) {
              case 'EN': return "Excuse me,\nI have <span style='color: var(--primary-color)'>severe food allergies</span>.\n<span style='font-size:15px; color:#666; font-weight:400; display:block; margin-top:8px'>Please help me check the ingredients carefully.</span>";
              case 'JA': return "すみません、\n私は<span style='color: var(--primary-color)'>重度の食物アレルギー</span>が\nあります。\n<span style='font-size:15px; color:#666; font-weight:400; display:block; margin-top:8px'>原材料の確認をお願いします。</span>";
              case 'ZH': return "不好意思，\n我有<span style='color: var(--primary-color)'>严重的食物过敏</span>。\n<span style='font-size:15px; color:#666; font-weight:400; display:block; margin-top:8px'>请帮我确认一下成分。</span>";
              default: return customMessage || defaultKorean; // KO returns original
          }
      }

      // 2. If it's a CUSTOM message (user typed it), we mock the Google Translate API
      if (currentLang === 'KO') return customMessage;

      // Mock Translation Logic for arbitrary text
      const mockPrefix = {
          'EN': "[Translated to English] ",
          'JA': "[日本語に翻訳] ",
          'ZH': "[翻译成中文] "
      };
      
      return `
        <div style="color:#333; font-weight:700; font-size:20px; line-height:1.4">
            ${mockPrefix[currentLang]}<br/>
            ${customMessage.replace(/<[^>]*>?/gm, '')} 
        </div>
        <div style="font-size:13px; color:#999; margin-top:8px; font-weight:400">
            * This is a mock translation for demo purposes.
        </div>
      `;
  };

  const currentUI = uiTranslations[currentLang];
  const displayMessage = getTranslatedMessage();

  return (
    <div style={{ perspective: '1000px', cursor: 'pointer', margin: '20px auto', width: '320px', height: '500px' }} onClick={() => setIsLangMenuOpen(false) || setIsFlipped(!isFlipped)}>
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
          {/* Birthdate removed per user request */}

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
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>
                        {currentLang === 'KO' ? allergen.name : (
                            currentLang === 'JA' ? allergen.jaName : (
                                currentLang === 'ZH' ? allergen.zhName : allergen.enName
                            )
                        )}
                    </span>
                </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', fontSize: '12px', color: '#aaa', display:'flex', alignItems:'center', gap:'4px' }}>
            <RotateCw size={12} />
            {currentUI.flipHint}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ 
                    background: 'var(--primary-color)', color: 'white', padding: '8px 16px', 
                    borderRadius: '20px', fontSize: '14px', fontWeight: 700
                }}>
                    {currentUI.notice}
                </div>
                
                {/* Language Selector */}
                <div style={{ position: 'relative' }}>
                    <div onClick={(e) => { e.stopPropagation(); setIsLangMenuOpen(!isLangMenuOpen); }} style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', 
                        background: '#f5f5f5', padding: '6px 12px', borderRadius: '16px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        border: isLangMenuOpen ? '1px solid #ddd' : '1px solid transparent'
                    }}>
                        <Languages size={16} color="#666" />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>
                            {languages.find(l => l.code === currentLang).label}
                        </span>
                        <ChevronDown size={14} color="#999" />
                    </div>

                    {/* Dropdown Menu */}
                    {isLangMenuOpen && (
                        <div style={{
                            position: 'absolute', right: 0, top: '120%', 
                            background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            padding: '8px', zIndex: 100, minWidth: '120px', border: '1px solid #eee'
                        }}>
                            {languages.map(lang => (
                                <div key={lang.code} 
                                    onClick={(e) => { e.stopPropagation(); handleLanguageSelect(lang.code); }}
                                    style={{
                                        padding: '8px 12px', borderRadius: '8px',
                                        fontSize: '13px', fontWeight: 500, color: '#333',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        cursor: 'pointer',
                                        background: currentLang === lang.code ? '#f0f0f0' : 'transparent'
                                    }}
                                >
                                    <span>{lang.icon}</span>
                                    <span>{lang.label}</span>
                                    {currentLang === lang.code && <Check size={14} color="var(--primary-color)" style={{ marginLeft: 'auto' }} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Notice Message Area (Scrollable to prevent overflow) */}
            <div className="no-scrollbar" style={{ 
                flex: 1, 
                marginBottom: '20px', 
                overflowY: 'auto',
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#333', lineHeight: 1.3, wordBreak: 'keep-all' }} 
                     dangerouslySetInnerHTML={{ __html: displayMessage.replace(/\n/g, '<br/>') }} />
            </div>

            <div style={{ background: '#FFF0ED', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-color)', fontWeight: 700 }}>
                    <ShieldCheck size={18} />
                    <span style={{ fontSize: '14px' }}>{currentUI.warningTitle}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedAllergens.map(a => (
                        <span key={a.id} style={{ 
                            background: 'white', padding: '6px 10px', borderRadius: '8px', 
                            fontSize: '14px', fontWeight: 600, border: '1px solid #ffccc7',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                            {a.icon} 
                            {currentLang === 'KO' ? a.name : (
                                currentLang === 'JA' ? a.jaName : (
                                    currentLang === 'ZH' ? a.zhName : a.enName
                                )
                            )}
                        </span>
                    ))}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default AllergyCard;

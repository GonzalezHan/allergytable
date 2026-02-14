import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Edit, User, Share2, Plus, Trash2, Check, X, ShieldCheck, Search, Bell } from 'lucide-react';
import { useAuth } from './AuthContext';
import AllergyCard from './AllergyCard';
import Footer from './components/Footer';
import './index.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // Mock user data specified by user requirements
    // Load user data from localStorage
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user_profile');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default to SSO info if available
        return {
            name: currentUser?.displayName || "김라연",
            birthDate: "2001.03.22",
            email: currentUser?.email || "rayeon@allergytable.com",
            allergies: ['shrimp', 'crab', 'peanut', 'egg'],
            severity: 'warning'
        };
    });

    // Force sync with SSO if default name is still present or if email doesn't match
    useEffect(() => {
        if (currentUser) {
            // Check if we need to sync
            const isDefaultName = user.name === "김라연";
            const isEmailMismatch = currentUser.email && (user.email !== currentUser.email);

            if (isDefaultName || isEmailMismatch) {
                console.log("Syncing profile with SSO data...");
                const updatedUser = {
                    ...user,
                    name: currentUser.displayName || user.name, // Use SSO name or keep existing (if SSO has no name)
                    email: currentUser.email || user.email
                };
                setUser(updatedUser);
                localStorage.setItem('user_profile', JSON.stringify(updatedUser));
            }
        }
    }, [currentUser, user]);

    // Save changes to localStorage (general sync)
    useEffect(() => {
        if (!localStorage.getItem('user_profile')) {
            localStorage.setItem('user_profile', JSON.stringify(user));
        }
    }, [user]);

    // Default message (Korean + English)
    const defaultMessage = "죄송하지만,\n저는 <span style='color: var(--danger-red)'>심각한 알러지</span>가\n있습니다.\n<span style='display:block; margin-top:8px'>Excuse me, I have severe food allergies. Please help me check the ingredients.</span>";

    // State for Custom Messages
    const [savedMessages, setSavedMessages] = useState([]);
    const [selectedMessageIndex, setSelectedMessageIndex] = useState(0); // 0 is default
    const [isEditingMessage, setIsEditingMessage] = useState(false);
    const [editingText, setEditingText] = useState("");

    // Load messages from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('allergy_card_messages');
        if (stored) {
            setSavedMessages(JSON.parse(stored));
        } else {
            // Initial default messages
            const initials = [
                defaultMessage,
                "I have severe food allergies.\nPlease check the ingredients carefully.\n<span style='font-size:14px; color:#666; display:block; margin-top:8px'>Could you modify the dish if possible?</span>",
                "卵、牛乳、ピーナッツのアレルギーがあります。\nご確認をお願いします。\n<span style='font-size:14px; color:#666; display:block; margin-top:8px'>Ingredients check please.</span>",
                "我对鸡蛋、牛奶、花生过敏。\n请确认成分。\n<span style='font-size:14px; color:#666; display:block; margin-top:8px'>Check ingredients please.</span>",
                "계란 알러지가 있습니다.\n계란이 들어있지 않은 메뉴를 추천해 주세요."
            ];
            setSavedMessages(initials);
            localStorage.setItem('allergy_card_messages', JSON.stringify(initials));
        }
    }, []);

    const saveMessages = (newMessages) => {
        setSavedMessages(newMessages);
        localStorage.setItem('allergy_card_messages', JSON.stringify(newMessages));
    };

    const handleMessageSelect = (index) => {
        setSelectedMessageIndex(index);
    };

    const handleEditStart = () => {
        if (savedMessages.length >= 5 && selectedMessageIndex === -1) {
            alert("최대 5개까지만 저장할 수 있습니다.");
            return;
        }
        setEditingText(savedMessages[selectedMessageIndex] || "");
        setIsEditingMessage(true);
    };

    const handleSaveMessage = () => {
        if (!editingText.trim()) return;
        
        const newMessages = [...savedMessages];
        if (selectedMessageIndex >= 0 && selectedMessageIndex < newMessages.length) {
            newMessages[selectedMessageIndex] = editingText;
        } else {
            if (newMessages.length >= 5) {
                alert("최대 5개까지만 저장할 수 있습니다.");
                return;
            }
            newMessages.push(editingText);
            setSelectedMessageIndex(newMessages.length - 1);
        }
        saveMessages(newMessages);
        setIsEditingMessage(false);
    };

    const handleAddNew = () => {
        if (savedMessages.length >= 5) {
            alert("최대 5개까지만 저장할 수 있습니다.");
            return;
        }
        setEditingText("");
        setSelectedMessageIndex(savedMessages.length); // New index
        setIsEditingMessage(true);
    };

    const handleDeleteMessage = (e, index) => {
        e.stopPropagation();
        if (window.confirm("이 안내 문구를 삭제하시겠습니까?")) {
            const newMessages = savedMessages.filter((_, i) => i !== index);
            saveMessages(newMessages);
            if (selectedMessageIndex === index) setSelectedMessageIndex(0);
            else if (selectedMessageIndex > index) setSelectedMessageIndex(selectedMessageIndex - 1);
        }
    };

    return (
        <div className="profile-page" style={{ 
            minHeight: '100vh', 
            background: '#F9F9F9', 
            paddingBottom: '80px',
            overflowX: 'hidden'
        }}>
            {/* Header: Changed title to MY, Added Search & Bell */}
            <div style={{ 
                padding: '16px 20px', 
                background: 'white', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 1px 0 rgba(0,0,0,0.05)'
            }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700 }}>MY</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                     <Search size={22} color="#333" cursor="pointer" onClick={() => navigate('/search')} />
                     <Bell size={22} color="#333" cursor="pointer" />
                     <Settings size={22} color="#333" cursor="pointer" onClick={() => navigate('/settings')} />
                </div>
            </div>

            {/* Banner/Introduction (Instruction text removed per user request) */}
            <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
                 {/* Empty spacer if needed, or just remove */}
            </div>

            {/* The Allergy Card */}
            <AllergyCard 
                user={user} 
                allergies={user.allergies} 
                customMessage={isEditingMessage ? editingText : savedMessages[selectedMessageIndex]} 
            />

            {/* Custom Message Manager */}
            <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', margin: 0 }}>안내 문구 선택</h3>
                    <button onClick={handleAddNew} disabled={savedMessages.length >= 5} style={{ 
                        background: 'none', border: 'none', color: 'var(--primary-color)', 
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                        <Plus size={14} /> 새 문구 추가 ({savedMessages.length}/5)
                    </button>
                </div>

                {isEditingMessage ? (
                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                            안내 문구 수정 (HTML 태그 사용 가능)
                        </label>
                        <textarea 
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            style={{ 
                                width: '100%', height: '80px', padding: '12px', borderRadius: '8px', 
                                border: '1px solid #ddd', fontSize: '14px', lineHeight: '1.5', resize: 'none',
                                boxSizing: 'border-box', fontFamily: 'sans-serif'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button onClick={handleSaveMessage} style={{ 
                                flex: 1, padding: '10px', background: 'var(--primary-color)', color: 'white', 
                                border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
                            }}>
                                <Check size={16} /> 저장
                            </button>
                            <button onClick={() => setIsEditingMessage(false)} style={{ 
                                flex: 1, padding: '10px', background: '#f5f5f5', color: '#666', 
                                border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
                            }}>
                                <X size={16} /> 취소
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {savedMessages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleMessageSelect(idx)}
                                style={{ 
                                    padding: '12px 16px', 
                                    background: selectedMessageIndex === idx ? 'rgba(0, 177, 106, 0.05)' : 'white', 
                                    border: selectedMessageIndex === idx ? '1px solid var(--primary-color)' : '1px solid #eee',
                                    borderRadius: '12px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}
                            >
                                <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px', color: '#333' }}>
                                    {msg.replace(/<[^>]*>?/gm, '').replace(/\n/g, ' ')}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {selectedMessageIndex === idx && (
                                        <button onClick={(e) => { e.stopPropagation(); handleEditStart(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 4 }}>
                                            <Edit size={14} />
                                        </button>
                                    )}
                                    <button onClick={(e) => handleDeleteMessage(e, idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4 }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions: Edited to remove Edit Info and make Share full width */}
            <div style={{ padding: '0 20px' }}>
                <button style={{ 
                    width: '100%',
                    padding: '12px', 
                    background: 'white', 
                    border: '1px solid #eee', 
                    borderRadius: '12px',
                    color: '#333', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                }}>
                    <Share2 size={18} />
                    카드 공유하기
                </button>
            </div>

            {/* Additional Menu */}
            <div style={{ margin: '30px 20px', background: 'white', borderRadius: '16px', padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <MenuItem icon={<User size={20} />} label="프로필 수정" onClick={() => navigate('/profile/edit')} />
                <div style={{ height: '1px', background: '#f5f5f5', margin: '0 16px' }} />
                <MenuItem icon={<Settings size={20} />} label="설정" onClick={() => navigate('/settings')} />
            </div>

            <Footer />

        </div>
    );
};

const MenuItem = ({ icon, label, onClick }) => (
    <div onClick={onClick} style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', 
        padding: '16px', cursor: 'pointer',
        color: '#333'
    }}>
        <div style={{ color: '#999' }}>{icon}</div>
        <span style={{ fontSize: '15px', fontWeight: 500 }}>{label}</span>
    </div>
);

export default ProfilePage;

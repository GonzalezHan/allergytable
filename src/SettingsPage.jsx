import React, { useState } from 'react';
import { ChevronLeft, LogOut, Bell, Shield, CircleHelp, FileText, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    
    const handleLogout = async () => {
        if (window.confirm('정말 로그아웃 하시겠습니까?')) {
            try {
                await logout();
                navigate('/login', { replace: true });
            } catch (error) {
                console.error("Failed to log out", error);
            }
        }
    };

    const SettingItem = ({ icon, label, onClick, isDestructive = false, showArrow = true }) => (
        <div onClick={onClick} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', background: 'white',
            borderBottom: '1px solid #f5f5f5', cursor: 'pointer'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: isDestructive ? '#ff4f4f' : '#333' }}>{icon}</div>
                <span style={{ fontSize: '15px', color: isDestructive ? '#ff4f4f' : '#333', fontWeight: 500 }}>{label}</span>
            </div>
            {showArrow && <div style={{ color: '#ccc' }}>›</div>}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F9F9F9', paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ 
                padding: '16px 20px', background: 'white', 
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: '0 1px 0 rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10
            }}>
                <ChevronLeft size={24} cursor="pointer" onClick={() => navigate(-1)} />
                <h1 style={{ fontSize: '18px', fontWeight: 700 }}>설정</h1>
            </div>

            {/* Account Section */}
            <div style={{ padding: '20px 20px 8px', fontSize: '13px', fontWeight: 600, color: '#888' }}>계정 관리</div>
            <SettingItem icon={<User size={20} />} label="프로필 수정" onClick={() => navigate('/profile/edit')} />
            
            {/* Account & Security - Expandable */}
            <SettingItem 
                icon={<Shield size={20} />} 
                label="계정 및 보안" 
                onClick={() => setShowAccountInfo(!showAccountInfo)}
                showArrow={false}
            />
            {showAccountInfo && (
                 <div style={{ padding: '0 20px 20px', background: 'white', borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ padding: '16px', background: '#F8F9FA', borderRadius: '12px', fontSize: '14px', color: '#444' }}>
                        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#888' }}>이름</span>
                            <span style={{ fontWeight: 600 }}>{currentUser?.displayName || '정보 없음'}</span>
                        </div>
                        {currentUser?.email && (
                            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888' }}>이메일</span>
                                <span style={{ fontWeight: 600 }}>{currentUser.email}</span>
                            </div>
                        )}
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#888' }}>로그인 구분</span>
                            <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                                {currentUser?.isGuest ? '게스트 로그인' : 'SSO 연동 계정'}
                            </span>
                        </div>
                    </div>
                 </div>
            )}

            <SettingItem icon={<Bell size={20} />} label="알림 설정" />

            {/* Logout */}
            <div style={{ marginTop: '20px' }}>
                <SettingItem icon={<LogOut size={20} />} label="로그아웃" onClick={handleLogout} isDestructive />
            </div>
        </div>
    );
};

export default SettingsPage;

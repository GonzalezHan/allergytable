import React from 'react';
import { ChevronLeft, LogOut, Bell, Shield, CircleHelp, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    
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

    const SettingItem = ({ icon, label, onClick, isDestructive = false }) => (
        <div onClick={onClick} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', background: 'white',
            borderBottom: '1px solid #f5f5f5', cursor: 'pointer'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: isDestructive ? '#ff4f4f' : '#333' }}>{icon}</div>
                <span style={{ fontSize: '15px', color: isDestructive ? '#ff4f4f' : '#333', fontWeight: 500 }}>{label}</span>
            </div>
            <div style={{ color: '#ccc' }}>›</div>
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
            <SettingItem icon={<Shield size={20} />} label="계정 및 보안" />
            <SettingItem icon={<Bell size={20} />} label="알림 설정" />

            {/* App Info Section */}
            <div style={{ padding: '20px 20px 8px', fontSize: '13px', fontWeight: 600, color: '#888' }}>앱 정보</div>
            <SettingItem icon={<CircleHelp size={20} />} label="고객센터 / 도움말" />
            <SettingItem icon={<FileText size={20} />} label="이용약관 및 개인정보처리방침" />
            <div style={{ padding: '16px 20px', fontSize: '13px', color: '#999', textAlign: 'center' }}>
                현재 버전 1.0.0
            </div>

            {/* Logout */}
            <div style={{ marginTop: '20px' }}>
                <SettingItem icon={<LogOut size={20} />} label="로그아웃" onClick={handleLogout} isDestructive />
            </div>
        </div>
    );
};

export default SettingsPage;

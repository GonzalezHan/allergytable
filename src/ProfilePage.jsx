import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Edit, User, Share2 } from 'lucide-react';
import AllergyCard from './AllergyCard';
import './index.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    
    // Mock user data - in a real app this would come from AuthContext
    const user = {
        name: "김라연",
        birthDate: "2001.03.22",
        email: "rayeon@allergytable.com",
        allergies: ['shrimp', 'crab', 'peanut', 'egg'] 
    };

    return (
        <div className="profile-page" style={{ 
            minHeight: '100vh', 
            background: '#F9F9F9', 
            paddingBottom: '80px',
            overflowX: 'hidden'
        }}>
            {/* Header */}
            <div style={{ 
                padding: '16px 20px', 
                background: 'white', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 1px 0 rgba(0,0,0,0.05)'
            }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700 }}>내 안심 카드</h1>
                <Settings size={22} color="#333" cursor="pointer" onClick={() => navigate('/settings')} />
            </div>

            {/* Banner/Introduction */}
            <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    식당 직원에게 이 카드를 보여주세요.
                </p>
                <div style={{ 
                    display: 'inline-block', 
                    background: '#E8F5E9', color: '#2E7D32', 
                    padding: '6px 12px', borderRadius: '20px', 
                    fontSize: '12px', fontWeight: 600 
                }}>
                    안심 인증 완료 ✨
                </div>
            </div>

            {/* The Allergy Card */}
            <AllergyCard user={user} allergies={user.allergies} />

            {/* Actions */}
            <div style={{ padding: '0 20px', display: 'flex', gap: '12px' }}>
                <button style={{ 
                    flex: 1, 
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
                <button 
                    onClick={() => navigate('/profile/edit')}
                    style={{ 
                    flex: 1, 
                    padding: '12px', 
                    background: 'white', 
                    border: '1px solid #eee', 
                    borderRadius: '12px',
                    color: '#333', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                }}>
                    <Edit size={18} />
                    정보 수정
                </button>
            </div>

            {/* Additional Menu */}
            <div style={{ margin: '30px 20px', background: 'white', borderRadius: '16px', padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <MenuItem icon={<User size={20} />} label="내 알러지 프로필 상세 설정" onClick={() => navigate('/profile/edit')} />
                <div style={{ height: '1px', background: '#f5f5f5', margin: '0 16px' }} />
                <MenuItem icon={<Settings size={20} />} label="앱 설정 및 계정 관리" />
            </div>

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

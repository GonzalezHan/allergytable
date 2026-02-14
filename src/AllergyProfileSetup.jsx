import React, { useState } from 'react';
import { ChevronLeft, Check, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

import { allergensList as allergenOptions, severityLevels } from './data';

const AllergyProfileSetup = ({ onBack, onSave, initialAllergies = [], initialSeverity = 'warning' }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [selectedAllergies, setSelectedAllergies] = useState(initialAllergies);
    const [severity, setSeverity] = useState(initialSeverity);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const toggleAllergy = (id) => {
        setSelectedAllergies(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        onSave && onSave({ allergies: selectedAllergies, severity });
    };

    return (
        <div className="profile-setup-container">
            {/* Header */}
            <header className="profile-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
                <h1>나의 알러지 프로필</h1>
                <button className="logout-button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                    <LogOut size={20} />
                </button>
            </header>

            <div className="profile-content">
                <p className="profile-subtitle">
                    안전한 외식을 위해 알러지 정보를 등록해주세요
                </p>

                {/* Allergy Grid */}
                <div className="allergy-grid">
                    {allergenOptions.map(allergen => (
                        <div
                            key={allergen.id}
                            className={`allergy-card ${selectedAllergies.includes(allergen.id) ? 'selected' : ''}`}
                            onClick={() => toggleAllergy(allergen.id)}
                        >
                            <span className="allergy-card-icon">{allergen.icon}</span>
                            <span className="allergy-card-name">{allergen.name}</span>
                            {selectedAllergies.includes(allergen.id) && (
                                <div className="allergy-card-check">
                                    <Check size={16} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Severity Selector */}
                <div className="severity-section">
                    <h3>알러지 심각도</h3>
                    <div className="severity-options">
                        {severityLevels.map(level => (
                            <button
                                key={level.id}
                                className={`severity-btn ${severity === level.id ? 'active' : ''}`}
                                style={{
                                    '--severity-color': level.color
                                }}
                                onClick={() => setSeverity(level.id)}
                            >
                                {level.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="profile-footer">
                <button
                    className="save-profile-btn"
                    onClick={handleSave}
                    disabled={selectedAllergies.length === 0}
                >
                    프로필 저장하기
                </button>
            </div>
        </div>
    );
};

export default AllergyProfileSetup;

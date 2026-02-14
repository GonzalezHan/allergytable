import React, { useState } from 'react';
import { ChevronLeft, Check, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

import { allergensList as allergenOptions, severityLevels } from './data';

const AllergyProfileSetup = ({ onBack, onSave, initialAllergies = [], initialSeverity = 'warning', initialName = '' }) => {
    const navigate = useNavigate();
    const [selectedAllergies, setSelectedAllergies] = useState(initialAllergies);
    const [severity, setSeverity] = useState(initialSeverity);
    const [name, setName] = useState(initialName);

    const toggleAllergy = (id) => {
        setSelectedAllergies(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        onSave && onSave({ name, allergies: selectedAllergies, severity });
    };

    return (
        <div className="profile-setup-container">
            {/* Header */}
            <header className="profile-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
                <h1>프로필 수정</h1>
                <div style={{ width: 24 }}></div> {/* Spacer for cleanup */}
            </header>

            <div className="profile-content">
                
                {/* Name Input Section */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>이름 (닉네임)</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력하세요"
                        style={{ 
                            width: '100%', padding: '12px 16px', borderRadius: '12px', 
                            border: '1px solid #ddd', fontSize: '16px', outline: 'none'
                        }}
                    />
                </div>

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
                    disabled={selectedAllergies.length === 0 || !name.trim()}
                >
                    저장하기
                </button>
            </div>
        </div>
    );
};

export default AllergyProfileSetup;

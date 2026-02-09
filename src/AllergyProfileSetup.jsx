import React, { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import './index.css';

const allergenOptions = [
    { id: 'egg', name: '계란', icon: '🥚' },
    { id: 'peanut', name: '땅콩', icon: '🥜' },
    { id: 'dairy', name: '유제품', icon: '🥛' },
    { id: 'wheat', name: '밀', icon: '🌾' },
    { id: 'soy', name: '대두', icon: '🫘' },
    { id: 'shellfish', name: '갑각류', icon: '🦐' },
    { id: 'fish', name: '생선', icon: '🐟' },
    { id: 'crab', name: '게', icon: '🦀' },
    { id: 'fruit', name: '과일', icon: '🍇' },
    { id: 'other', name: '기타', icon: '🥗' },
];

const severityLevels = [
    { id: 'mild', name: '경미', color: '#4CAF50' },
    { id: 'warning', name: '주의', color: '#FF9800' },
    { id: 'severe', name: '심각', color: '#F44336' },
];

const AllergyProfileSetup = ({ onBack, onSave, initialAllergies = [], initialSeverity = 'warning' }) => {
    const [selectedAllergies, setSelectedAllergies] = useState(initialAllergies);
    const [severity, setSeverity] = useState(initialSeverity);

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
                <div style={{ width: 24 }} /> {/* Spacer */}
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

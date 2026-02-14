import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    const linkStyle = {
        cursor: 'pointer',
        color: '#999',
        fontSize: '11px',
        textDecoration: 'none',
    };

    const separatorStyle = {
        margin: '0 6px',
        color: '#ddd',
        fontSize: '10px'
    };

    return (
        <div style={{ padding: '30px 20px 80px', background: '#f9f9f9', textAlign: 'center', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', lineHeight: '1.8', marginBottom: '16px' }}>
                <span style={linkStyle} onClick={() => navigate('/settings/terms')}>이용약관</span>
                <span style={separatorStyle}>|</span>
                <span style={{ ...linkStyle, fontWeight: 'bold' }} onClick={() => navigate('/settings/terms')}>개인정보처리방침</span>
                <span style={separatorStyle}>|</span>
                <span style={linkStyle} onClick={() => navigate('/settings/terms')}>위치기반서비스 이용약관</span>
                <span style={separatorStyle}>|</span>
                <span style={linkStyle} onClick={() => navigate('/settings/help')}>고객센터</span>
            </div>
            
            <div style={{ fontSize: '10px', color: '#ccc', lineHeight: '1.5' }}>
                Copyright © AllergyTable. All Rights Reserved.
            </div>
        </div>
    );
};

export default Footer;

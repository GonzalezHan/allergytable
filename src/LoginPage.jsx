import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

const LoginPage = () => {
    const { loginWithGoogle, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [currentUser, navigate, location]);

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            // Navigation handled by useEffect
        } catch (error) {
            console.error("Google login failed", error);
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleKakaoLogin = () => {
        // TODO: Implement Kakao OAuth
        console.log('Kakao login clicked');
    };

    const handleNaverLogin = () => {
        // TODO: Implement Naver OAuth
        console.log('Naver login clicked');
    };

    const handleAppleLogin = () => {
        // TODO: Implement Apple Sign In
        console.log('Apple login clicked');
    };

    const handleGuestContinue = () => {
        // Just navigate to home, AuthContext/RequireAuth handles the rest?
        // Actually, if we want guest mode, we need to handle it.
        // For now, let's just go home, but RequireAuth might bounce us back if we strictly require auth.
        // If we want to allow guest access, we should probably modify RequireAuth or 
        // set a 'guest' user in context. 
        // For this iteration, let's assume we want to protect the main flow, 
        // but maybe the user wants to browse without login. 
        // For simplicity's sake in this "Google Login" task, let's enforce login for now,
        // or just let them go to home and see what happens (they get bounced back).

        // Strategy: We haven't implemented Guest Mode in AuthContext.
        // Let's make Guest Continue imply "Ignore login for now" or just alert.
        alert("게스트 모드는 아직 준비중입니다.");
    };

    return (
        <div className="login-container">
            {/* Logo Section */}
            <div className="login-header">
                <div className="login-logo">
                    <ShieldCheck size={48} color="var(--safe-green)" />
                </div>
                <h1 className="login-title">알러지테이블</h1>
                <p className="login-tagline">안심 외식의 시작</p>
            </div>

            {/* Social Login Buttons */}
            <div className="login-buttons">
                <button
                    className="social-login-btn google"
                    onClick={handleGoogleLogin}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google로 시작하기
                </button>

                <button
                    className="social-login-btn kakao"
                    onClick={handleKakaoLogin}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.86 5.33 4.64 6.74-.15.54-.96 3.47-1 3.64 0 .06.02.12.07.16.04.03.09.05.14.05.08 0 .16-.03.43-.22 1.76-1.26 2.78-1.99 3.24-2.33.49.07.99.1 1.48.1 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                    </svg>
                    카카오로 시작하기
                </button>

                <button
                    className="social-login-btn naver"
                    onClick={handleNaverLogin}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                    </svg>
                    네이버로 시작하기
                </button>

                <button
                    className="social-login-btn apple"
                    onClick={handleAppleLogin}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Apple로 시작하기
                </button>
            </div>

            {/* Benefit Text */}
            <p className="login-benefit">
                로그인하면 나만의 알러지 프로필을 저장할 수 있어요
            </p>

            {/* Guest Continue */}
            <button
                className="guest-link"
                onClick={handleGuestContinue}
            >
                로그인 없이 둘러보기
            </button>
        </div>
    );
};

export default LoginPage;

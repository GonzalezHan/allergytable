import Footer from './components/Footer';

const LoginPage = () => {
    // ... existing hook calls ...
    const { loginWithGoogle, loginWithKakao, loginWithNaver, loginAsGuest, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ... existing code ...

    return (
        <div className="login-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Logo Section */}
                <div className="login-header">
                    <div className="login-logo" style={{ background: 'transparent' }}>
                        <img src="/logo.png" alt="AllergyTable Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
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
                </div>
    
                {/* Benefit Text */}
                <p className="login-benefit">
                    로그인하면 나만의 알러지 프로필을 저장할 수 있어요
                </p>
    
                {/* Hidden Naver Login Button for SDK */}
                <div id="naverIdLogin" style={{ display: 'none' }}></div>
    
                {/* Guest Continue */}
                <button
                    className="guest-link"
                    onClick={handleGuestContinue}
                >
                    로그인 없이 둘러보기
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;

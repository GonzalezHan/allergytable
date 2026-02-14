import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function loginWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    // SSO Mock/SDK Implementations
    const loginWithKakao = () => {
        return new Promise((resolve, reject) => {
            if (!window.Kakao) return reject('카카오 SDK 서버와 연결되지 않았습니다.');

            // Re-ensure initialization (safe even if already done)
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init('6758187da106ac91415a4fc813c1edde');
            }

            if (!window.Kakao.Auth || typeof window.Kakao.Auth.login !== 'function') {
                console.error('Kakao.Auth details:', window.Kakao.Auth);
                return reject('카카오 인증 모듈이 아직 준비되지 않았습니다. 잠시 후 버튼을 다시 눌러주세요.');
            }

            window.Kakao.Auth.loginForm({
                success: function (authObj) {
                    console.log('Kakao login success', authObj);
                    // In real app, exchange for Firebase Custom Token
                    setCurrentUser({ displayName: '카카오 사용자', photoURL: '' });
                    resolve(authObj);
                },
                fail: function (err) {
                    reject(err);
                }
            });
        });
    };

    const loginWithNaver = (naverUser) => {
        if (naverUser) {
            setCurrentUser({
                displayName: naverUser.getName() || '네이버 고객님',
                photoURL: naverUser.getProfileImage() || ''
            });
        } else {
            // Manual trigger or dummy
            setCurrentUser({ displayName: '네이버 고객님', photoURL: '' });
        }
    };

    const loginAsGuest = () => {
        setCurrentUser({ displayName: '게스트', isGuest: true });
    };

    function logout() {
        setCurrentUser(null);
        return signOut(auth);
    }

    useEffect(() => {
        let mounted = true;
        console.log("AuthContext: Initializing...");

        // Safety timeout: If Firebase doesn't respond in 2s, stop loading
        const timeoutId = setTimeout(() => {
            if (mounted && loading) {
                console.warn("AuthContext: Firebase init timed out, forcing loading to false.");
                setLoading(false);
            }
        }, 2000);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("AuthContext: Auth state changed", user ? "User found" : "No user");
            if (mounted) {
                setCurrentUser(user);
                setLoading(false);
                clearTimeout(timeoutId);
            }
        }, (error) => {
             console.error("AuthContext: Auth Error", error);
             if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
            unsubscribe();
        };
    }, []);

    const value = {
        currentUser,
        loginWithGoogle,
        loginWithKakao,
        loginWithNaver,
        loginAsGuest,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

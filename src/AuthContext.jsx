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
            if (!window.Kakao) return reject('Kakao SDK not loaded');
            window.Kakao.Auth.login({
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

    function logout() {
        setCurrentUser(null);
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loginWithGoogle,
        loginWithKakao,
        loginWithNaver,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

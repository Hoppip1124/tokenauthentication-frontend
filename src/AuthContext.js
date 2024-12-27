import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            setLoading(true);
            //トークンがあればサーバーに検証リクエストを送る
            //setIsAuthenticated(true);
            fetch('/api/user', {
                headers: { 'Authorization': `Bearer ${storedToken}` },
                signal
            })
            .then(res => {
                if (!res.ok) {
                    //エラー処理
                    if (res.status === 401) {
                        sessionStorage.removeItem('token');
                    }
                    throw new Error("Failed to fetch user data");
                }
                return res.json();
            })
            .then(userData => {
                setUser(userData);
                setIsAuthenticated(true);// サーバーからの応答が成功した場合のみ認証状態をtrueに設定
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // エラーが発生した場合は認証状態をfalseにするなどの処理が必要に応じて追加
                setIsAuthenticated(false);
                sessionStorage.removeItem('token');
            })
            .finally(() => setLoading(false))
            console.log("ResultSetUser: ", user);
        } else {
            setLoading(false);
        }
        return () => controller.abort();
    }, []);

    useEffect(() => {
        console.log("user stateが変更されました: ", user);
    }, [user]);

    const login = useCallback(async (credentials, signal) => {
        try {
            //SpringBootへAPIリクエスト送信処理
            const response = await fetch('http://localhost:8080/auth/login',{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
                signal: signal
            });

            console.log('response', response);
            console.log('response.ok', response.ok);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'ログインに失敗しました');
              }      

            const data = await response.json();
            console.log("userData:", data);
            setIsAuthenticated(true);
            sessionStorage.setItem('token', data.token);
            //setUser({name: data.name});
            setUser(data);
            return data;
        } catch (error) {
            console.error("Login Error", error);
            throw error;  
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            const token = sessionStorage.getItem('token');
            console.log('ログアウト前トークン', token);
            if (!token) {
                console.warn("No token found in sessionStorage.");
                return;
            }
            const response = await fetch('http://localhost:8080/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer &{token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Logout failed:', errorData.message || response.statusText);
                //必要に応じてエラーハンドリング
            }
        } catch (error) {
            console.error('Logout error:', error);
            //エラーハンドリング
        } finally {
            sessionStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            window.location.href.replace('/');
        }
    }, []);

    const value = useMemo(() => ({
        isAuthenticated,
        user,
        loading,
        login,
        logout }), [ isAuthenticated, user, loading, logout ]);

    return (
        <AuthContext.Provider value={ value }>
            { !loading && children }
        </AuthContext.Provider>
    );
};
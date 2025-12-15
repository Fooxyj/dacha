import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../config';

// Types
interface User {
    id: number;
    username: string;
    first_name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/user/`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (data: any) => {
        const response = await fetch(`${API_URL}/api/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            throw new Error('Неверный логин или пароль');
        }
    };

    const register = async (data: any) => {
        const response = await fetch(`${API_URL}/api/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            const errData = await response.json();
            const errorMsg = Object.values(errData).flat().join(', ');
            throw new Error(errorMsg || 'Ошибка регистрации');
        }
    };

    const logout = async () => {
        await fetch(`${API_URL}/api/auth/logout/`, { method: 'POST', credentials: 'include' });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

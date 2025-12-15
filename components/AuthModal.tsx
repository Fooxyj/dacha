import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0 && value[0] !== '7') value = '7' + value;
        value = value.substring(0, 11);

        let formattedValue = '';
        if (value.length > 0) formattedValue += '+7';
        if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
        if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
        if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
        if (value.length > 9) formattedValue += '-' + value.substring(9, 11);

        setFormData({ ...formData, phone: formattedValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Sanitize phone for username (allow only digits and +)
        const cleanUsername = formData.phone.replace(/[^\d+]/g, '');

        try {
            if (isLoginMode) {
                await login({ username: cleanUsername, password: formData.password });
            } else {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Пароли не совпадают');
                }
                await register({
                    username: cleanUsername,
                    password: formData.password,
                    first_name: formData.name,
                    email: formData.email
                });
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex bg-gray-50 border-b border-gray-100">
                    <button
                        className={`flex-1 py-4 font-bold text-sm transition-colors ${isLoginMode ? 'text-brand-black bg-white border-b-2 border-brand-yellow' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => { setIsLoginMode(true); setError(''); }}
                    >
                        Войти
                    </button>
                    <button
                        className={`flex-1 py-4 font-bold text-sm transition-colors ${!isLoginMode ? 'text-brand-black bg-white border-b-2 border-brand-yellow' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => { setIsLoginMode(false); setError(''); }}
                    >
                        Регистрация
                    </button>
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                        {!isLoginMode && (
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ваше имя"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 focus:border-transparent outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+7 (___) ___-__-__"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 focus:border-transparent outline-none transition-all font-mono"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                            />
                        </div>

                        {!isLoginMode && (
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email (необязательно)"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 focus:border-transparent outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 focus:border-transparent outline-none transition-all"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {!isLoginMode && (
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Повторите пароль"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 focus:border-transparent outline-none transition-all"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-yellow hover:brightness-105 text-brand-black py-3 rounded-xl font-bold shadow-lg shadow-brand-yellow/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;

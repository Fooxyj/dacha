import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Loader2, CheckCircle } from 'lucide-react';
import Button from './Button';
import { API_URL } from '../config';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        setIsSubmitting(true);
        setError('');

        try {
            const getCookie = (name: string) => {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            };

            const csrftoken = getCookie('csrftoken');

            const response = await fetch(`${API_URL}/api/reservations/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken || '',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                setError('Ошибка при отправке. Попробуйте позже.');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setIsSuccess(false);
            setFormData({ name: '', phone: '', date: '', time: '', guests: '2', comment: '' });
            setError('');
        }, 300);
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
                <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-brand-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Столик забронирован!</h2>
                    <p className="text-gray-500 mb-8">
                        Ждем вас {formData.date} в {formData.time}.<br />
                        Мы перезвоним для подтверждения.
                    </p>
                    <button
                        onClick={handleClose}
                        className="w-full bg-brand-green hover:bg-brand-green/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-green/20 active:scale-95 transition-all"
                    >
                        Отлично
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="bg-brand-green px-6 py-6 text-white flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-serif font-bold">Бронирование стола</h2>
                        <p className="text-white/80 text-sm mt-1">Проведите время в уютной атмосфере</p>
                    </div>
                    <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User size={16} /> Ваше имя
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                            placeholder="Иван Иванов"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Phone size={16} /> Телефон
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all font-mono"
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Calendar size={16} /> Дата
                            </label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Clock size={16} /> Время
                            </label>
                            <input
                                type="time"
                                name="time"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Количество гостей</label>
                        <select
                            name="guests"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                            value={formData.guests}
                            onChange={handleChange}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'человек' : n < 5 ? 'человека' : 'человек'}</option>
                            ))}
                            <option value="9">Более 8 (менеджер свяжется)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Комментарий (необязательно)</label>
                        <textarea
                            name="comment"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none h-20"
                            placeholder="Пожелания к столику..."
                            value={formData.comment}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                            {isSubmitting ? 'Отправка...' : 'Подтвердить бронь'}
                        </Button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationModal;
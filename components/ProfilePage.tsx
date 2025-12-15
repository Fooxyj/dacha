import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Package, Calendar, Clock, Plus, Trash2, LogOut } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

interface OrderItem {
    title: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    total_price: number;
    status: string;
    created_at: string;
    items: string; // JSON string
    address: string;
}

interface Address {
    id: number;
    address: string;
    is_default: boolean;
}

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchProfileData();
    }, [user, navigate]);

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token'); // If we were using tokens, but we rely on session/cookie
            const response = await fetch(`${API_URL}/api/profile/data/`, { credentials: 'include' }); // Browser automatically sends cookies
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getStatusLabel = (status: string) => {
        const statuses: { [key: string]: string } = {
            'new': 'Новый',
            'kitchen': 'На кухне',
            'delivery': 'В доставке',
            'completed': 'Выполнен',
            'cancelled': 'Отменен'
        };
        return statuses[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'new': 'bg-blue-100 text-blue-800',
            'kitchen': 'bg-yellow-100 text-yellow-800',
            'delivery': 'bg-orange-100 text-orange-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dacha-green"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* User Info Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-brand-yellow/20 rounded-full flex items-center justify-center text-brand-black">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-black">{user?.first_name || user?.username}</h1>
                            <p className="text-gray-500">{user?.username || ''}</p> {/* Usually phone */}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={18} />
                        Выйти
                    </button>
                </div>

                {/* Content Tabs */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                    <div className="flex border-b border-gray-100">
                        <div
                            className="flex-1 py-4 text-center font-bold text-sm bg-brand-yellow/10 text-brand-black border-b-2 border-brand-yellow transition-all"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Package size={18} />
                                Мои заказы
                            </div>
                        </div>

                    </div>

                    <div className="p-6 md:p-8">
                        {orders.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <Package size={48} className="mx-auto mb-4 opacity-50" />
                                <p>У вас пока нет заказов</p>
                            </div>
                        ) : (
                            orders.map((order, index) => (
                                <div key={order.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg">Заказ #{orders.length - index}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-4">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {(() => {
                                            try {
                                                const items: OrderItem[] = JSON.parse(order.items);
                                                return items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm text-gray-600 border-b border-gray-50 last:border-0 py-1">
                                                        <span>{item.title} <span className="text-gray-400">x{item.quantity}</span></span>
                                                        <span className="font-medium">{item.price * item.quantity} ₽</span>
                                                    </div>
                                                ));
                                            } catch (e) {
                                                return <p className="text-sm text-red-400">Ошибка отображения состава</p>;
                                            }
                                        })()}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="text-sm text-gray-500 max-w-[200px] md:max-w-none truncate" title={order.address}>
                                            <MapPin size={14} className="inline mr-1" /> {order.address}
                                        </div>
                                        <div className="text-xl font-bold text-brand-black">
                                            {order.total_price} ₽
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

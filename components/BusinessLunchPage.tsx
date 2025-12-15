import React, { useEffect, useState } from 'react';
import { ArrowLeft, Phone, Calendar, Salad, Soup, UtensilsCrossed, Wheat, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessLunchPage: React.FC = () => {
    const [lunch, setLunch] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/lunch/')
            .then(res => res.json())
            .then(data => {
                setLunch(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch lunch:", err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div className="min-h-screen pt-32 text-center">Загрузка меню...</div>;

    // Fallback if no lunch menu is active
    if (!lunch) return (
        <div className="min-h-screen pt-32 text-center px-4">
            <h1 className="text-2xl font-bold mb-4">На сегодня бизнес-ланч еще не сформирован</h1>
            <p className="text-gray-500 mb-6">Загляните чуть позже или уточните по телефону.</p>
            <Link to="/" className="text-brand-green font-bold hover:underline">Вернуться на главную</Link>
        </div>
    );

    const parseList = (text: string) => {
        if (!text) return [];
        return text.split('\n').filter(line => line.trim() !== '');
    };

    return (
        <main className="py-12 px-4 min-h-screen bg-[#F5F4F2]">
            <section className="max-w-3xl mx-auto pt-20"> {/* pt-20 for fixed navbar */}
                <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-brand-black text-white p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div>
                            <div className="inline-block bg-brand-yellow text-brand-black text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                                Меню на сегодня
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold font-sans">Бизнес-ланч</h1>
                            <p className="text-gray-400 mt-2 font-medium flex items-center gap-2 justify-center md:justify-start">
                                <Calendar className="w-4 h-4" /> {lunch.date}
                            </p>
                        </div>
                    </div>

                    {/* Menu Content */}
                    <div className="p-6 md:p-10 grid md:grid-cols-2 gap-8 md:gap-12 bg-white">

                        {/* Column 1 */}
                        <div className="space-y-8">
                            {/* Salads */}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-brand-green uppercase text-sm tracking-wider mb-4 border-b border-gray-100 pb-2">
                                    <Salad className="w-5 h-5" /> Салаты
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    {parseList(lunch.salads).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-2 shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Soups */}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-brand-green uppercase text-sm tracking-wider mb-4 border-b border-gray-100 pb-2">
                                    <Soup className="w-5 h-5" /> Супы
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    {parseList(lunch.soups).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-2 shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-8">
                            {/* Hot */}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-brand-green uppercase text-sm tracking-wider mb-4 border-b border-gray-100 pb-2">
                                    <UtensilsCrossed className="w-5 h-5" /> Горячее
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    {parseList(lunch.hot_dishes).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-2 shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Garnish & Others */}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-brand-green uppercase text-sm tracking-wider mb-4 border-b border-gray-100 pb-2">
                                    <Wheat className="w-5 h-5" /> Гарниры, Напитки
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    {parseList(lunch.garnishes).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-2 shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Price List */}
                    <div className="bg-gray-50 border-t border-gray-200 p-6 md:p-10">
                        <h3 className="text-xl font-bold text-brand-black mb-6 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-brand-green" /> Стоимость обеда
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {/* Full Meal */}
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-brand-green shadow-sm col-span-1 md:col-span-2">
                                <span className="font-bold text-brand-black flex items-center gap-2">
                                    <span className="bg-brand-green text-white text-[10px] px-2 py-0.5 rounded uppercase">Выгодно</span>
                                    Салат + Суп + Горячее
                                </span>
                                <span className="text-xl font-extrabold text-brand-green">{lunch.price_3_course} ₽</span>
                            </div>

                            {/* Combos */}
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                                    <span className="text-gray-600 font-medium">Салат + Суп</span>
                                    <span className="font-bold text-brand-black">{lunch.price_salad_soup} ₽</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                                    <span className="text-gray-600 font-medium">Салат + Горячее</span>
                                    <span className="font-bold text-brand-black">{lunch.price_salad_hot} ₽</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                                    <span className="text-gray-600 font-medium">Суп + Горячее</span>
                                    <span className="font-bold text-brand-black">{lunch.price_soup_hot} ₽</span>
                                </div>
                            </div>

                            {/* Single Items MOCK for now since model doesn't have individual prices explicitly, or we can assume defaults */}
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                                    <span className="text-gray-600">Только Горячее</span>
                                    <span className="font-bold text-gray-800">270 ₽</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                                    <span className="text-gray-600">Только Суп</span>
                                    <span className="font-bold text-gray-800">170 ₽</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed">
                                    <span className="text-gray-600">Только Салат</span>
                                    <span className="font-bold text-gray-800">150 ₽</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="text-center mt-8 pb-8">
                    <p className="text-gray-500 text-sm mb-4">Бизнес-ланчи подаются по будням с 12:00 до 16:00</p>
                    <a href="tel:+73514692211" className="inline-flex items-center gap-2 text-brand-green font-bold hover:underline">
                        <Phone className="w-4 h-4" /> Заказать заранее
                    </a>
                </div>

            </section>
        </main>
    );
};

export default BusinessLunchPage;

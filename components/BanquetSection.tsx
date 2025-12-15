import React, { useState, useEffect } from 'react';
import { LayoutGrid, Music, Heart, Users, FileText, Baby, Smile, Image as ImageIcon } from 'lucide-react';
import BanquetModal from './BanquetModal';
import { API_URL, getImageUrl } from '../config';

interface BanquetMenu {
    id: number;
    title: string;
    description: string;
    category: 'adult' | 'children';
    price_per_person: number | null;
    cover_image: string;
    layout_type: 'image' | 'list';
    content_image: string | null;
    items_json: string;
}

const BanquetSection: React.FC = () => {
    const [menus, setMenus] = useState<BanquetMenu[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<BanquetMenu | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/banquet-menus/`)
            .then(res => res.json())
            .then(data => setMenus(data))
            .catch(err => console.error("Failed to fetch banquet menus", err));
    }, []);

    const handleOpenMenu = (menu: BanquetMenu) => {
        setSelectedMenu(menu);
        setIsModalOpen(true);
    };

    return (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-4">Банкетное меню</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Планируете торжество? Дача — идеальное место для тихих дружеских встреч, свадеб, юбилеев или корпоративов.
                    </p>
                </div>

                {/* INFO BLOCK: HALLS & SERVICES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* Block 1: Capacity */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-brand-yellow/20 text-brand-black rounded-2xl flex items-center justify-center mb-4">
                            <LayoutGrid className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl mb-3">4 Уютных зала</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><span>●</span> 2 малых зала (до 25 чел)</li>
                            <li className="flex items-center gap-2"><span>●</span> Средний зал (до 45 чел)</li>
                            <li className="flex items-center gap-2"><span>●</span> Большой зал (до 85 чел)</li>
                        </ul>
                    </div>

                    {/* Block 2: Organization */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                            <Music className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl mb-3">Праздник под ключ</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            Администрация кафе поможет подобрать профессионального ведущего и диджея для вашего мероприятия.
                        </p>
                    </div>

                    {/* Block 3: Atmosphere */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl mb-3">Душевно и Вкусно</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            В кафе «Дача» большие и маленькие компании не мешают друг другу. Вас всегда встретят с улыбкой и очень вкусно накормят!
                        </p>
                    </div>
                </div>
                {/* END INFO BLOCK */}

                {menus.length > 0 ? (
                    <div className="space-y-16">
                        {/* Adult Menus */}
                        {menus.filter(m => m.category === 'adult').length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-brand-black text-white rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-black">Основное меню</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {menus.filter(m => m.category === 'adult').map(menu => (
                                        <div
                                            key={menu.id}
                                            onClick={() => handleOpenMenu(menu)}
                                            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
                                        >
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={getImageUrl(menu.cover_image)}
                                                    alt={menu.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                        Посмотреть меню
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-brand-black">{menu.title}</h3>
                                                    {menu.layout_type === 'image' ? <ImageIcon size={20} className="text-gray-400" /> : <FileText size={20} className="text-gray-400" />}
                                                </div>
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{menu.description}</p>

                                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                                    {menu.price_per_person ? (
                                                        <span className="font-bold text-lg text-brand-black">{menu.price_per_person} ₽ <span className="text-xs font-normal text-gray-400">/ чел</span></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <span className="text-brand-green text-sm font-bold group-hover:underline">Подробнее →</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Children Menus */}
                        {menus.filter(m => m.category === 'children').length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center">
                                        <Baby className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-black">Детское меню</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {menus.filter(m => m.category === 'children').map(menu => (
                                        <div
                                            key={menu.id}
                                            onClick={() => handleOpenMenu(menu)}
                                            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
                                        >
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={getImageUrl(menu.cover_image)}
                                                    alt={menu.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                        Посмотреть меню
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-brand-black">{menu.title}</h3>
                                                    {menu.layout_type === 'image' ? <ImageIcon size={20} className="text-gray-400" /> : <FileText size={20} className="text-gray-400" />}
                                                </div>
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{menu.description}</p>

                                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                                    {menu.price_per_person ? (
                                                        <span className="font-bold text-lg text-brand-black">{menu.price_per_person} ₽ <span className="text-xs font-normal text-gray-400">/ чел</span></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                    <span className="text-brand-green text-sm font-bold group-hover:underline">Подробнее →</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                        <p className="text-gray-400">Меню скоро появится...</p>
                    </div>
                )}
            </div>

            <BanquetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                menu={selectedMenu}
            />
        </section>
    );
};

export default BanquetSection;

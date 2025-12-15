import React from 'react';
import { X, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../config';

interface BanquetMenu {
    id: number;
    title: string;
    description: string;
    price_per_person: number | null;
    cover_image: string;
    layout_type: 'image' | 'list';
    content_image: string | null;
    items_json: string;
}

interface BanquetModalProps {
    isOpen: boolean;
    onClose: () => void;
    menu: BanquetMenu | null;
}

const BanquetModal: React.FC<BanquetModalProps> = ({ isOpen, onClose, menu }) => {
    if (!isOpen || !menu) return null;

    let items = [];
    try {
        items = JSON.parse(menu.items_json);
    } catch (e) {
        console.error("Failed to parse menu items", e);
    }

    const contentImageUrl = getImageUrl(menu.content_image);

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-black">{menu.title}</h2>
                        {menu.price_per_person && (
                            <p className="text-brand-green font-bold text-lg">{menu.price_per_person} ₽ <span className="text-sm font-normal text-gray-500">/ чел</span></p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
                    {menu.layout_type === 'image' && menu.content_image ? (
                        <div className="flex flex-col items-center">
                            <img
                                src={contentImageUrl}
                                alt={menu.title}
                                className="w-full h-auto rounded-xl shadow-sm"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {items.map((section: any, idx: number) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-brand-black mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
                                        {section.category}
                                    </h3>
                                    <ul className="space-y-3">
                                        {section.items.map((item: string, i: number) => (
                                            <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                                <span className="text-gray-300 mt-1.5">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {menu.description && (
                        <div className="mt-8 bg-brand-green/5 p-6 rounded-xl border border-brand-green/10">
                            <h4 className="font-bold text-brand-black mb-2">Описание</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{menu.description}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-100 p-6 shrink-0 flex justify-between items-center">
                    <p className="text-xs text-gray-400 max-w-[60%]">
                        Администрация оставляет за собой право вносить изменения в меню
                    </p>
                    {menu.layout_type === 'image' && (
                        <a
                            href={contentImageUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-brand-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                            <Download size={18} /> Скачать меню
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BanquetModal;

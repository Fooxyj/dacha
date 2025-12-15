import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: MenuItem | null;
    onAddToCart: (item: MenuItem, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        setQuantity(1); // Reset
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white w-full max-w-lg mx-4 md:mx-auto rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                    <X size={24} className="text-brand-black" />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-1/2 min-h-[300px] md:h-auto relative bg-gray-100 flex items-center justify-center overflow-hidden">
                        {/* Background Blurred Layer */}
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-xl opacity-60 scale-110"
                            style={{ backgroundImage: `url(${product.image ? `http://127.0.0.1:8000${product.image}` : '/placeholder.jpg'})` }}
                        />

                        {/* Main Image */}
                        <img
                            src={product.image ? `http://127.0.0.1:8000${product.image}` : '/placeholder.jpg'}
                            alt={product.title}
                            className="relative z-10 w-full h-full object-contain p-4 drop-shadow-lg transition-transform duration-300 hover:scale-105"
                        />

                        {product.popular && (
                            <div className="absolute top-4 left-4 bg-brand-yellow text-brand-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-20">
                                Хит
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                        <div className="flex-1">
                            <h2 className="text-2xl font-extrabold text-brand-black mb-2 leading-tight">{product.title}</h2>
                            <p className="text-gray-400 text-sm font-medium mb-4">{product.weight}</p>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {product.description || "Вкусное блюдо от шеф-повара. Свежие ингредиенты и любовь к своему делу."}
                            </p>
                        </div>

                        <div className="mt-auto pt-4 space-y-4">
                            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-500 hover:text-black transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="font-bold text-xl text-brand-black">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-500 hover:text-black transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-brand-yellow hover:brightness-105 text-brand-black py-4 rounded-2xl font-bold text-lg shadow-float active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Добавить за {product.price * quantity} ₽</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;

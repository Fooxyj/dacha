import React, { useState, useEffect } from 'react';
import { MapPin, Phone } from 'lucide-react';

interface FooterProps {
    backendStatus: string;
}

const Footer: React.FC<FooterProps> = ({ backendStatus }) => {
    return (
        <footer className="bg-brand-black text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

                    {/* Brand & Social */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-extrabold text-2xl tracking-tight text-white mb-2">
                                Дача <span className="font-medium text-gray-400">для Друзей</span>
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Уютное место в Снежинске, где вкусная еда встречается с теплой атмосферой.
                            </p>
                        </div>

                        {/* Socials */}
                        <div className="flex gap-4">
                            {/* VK Icon */}
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#0077FF] rounded-xl flex items-center justify-center transition-colors text-white group">
                                <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.9,7.4c0.2-0.7,0-1.5-1.2-1.5h-4c-1.1,0-1.6,0.6-1.9,1.2c0,0-2.2,5.2-5.3,8.6 c-1,1-1.5,1.3-2,1.3c-0.3,0-0.7-0.3-0.7-1.2v-5.6c0-0.7-0.2-1.1-0.6-1.4c-0.4-0.3-1-0.4-1.5-0.4c-0.3,0-0.6,0.1-0.9,0.3 c-0.6,0.5,0.4,1,1.4,1.3c0.6,0.2,0.8,0.7,0.8,2v4.4c0,0.9-0.2,1.6-1.6,1.6c-2.3,0-7.8-8.2-7.8-8.2C-0.7,9,0.5,7.4,0.5,7.4H4 c1.2,0,1.3,0.6,1.3,0.6s2.3,5.5,5.4,8.3c1,0.9,1.7,0.7,1.7,0.7v-4.8c0-1.5-0.4-2.2-1.2-2.3c0.4-1.5,2-2.5,4.3-2.3 c1.5,0.1,2.5,0.9,2.8,2.5c0,0,0.8,3.9,1.9,5.7c1,1.7,1.8,1.3,1.8,1.3l3.6-0.1c1.1,0,1.5-0.6,1.2-1.3C25.8,13.6,22.2,9.6,20.9,7.4z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Menu Links (Help) */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Помощь</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="policy.html" className="hover:text-brand-yellow transition-colors">Политика обработки персональных данных</a></li>
                            <li><a href="offer.html" className="hover:text-brand-yellow transition-colors">Публичная оферта</a></li>
                            <li><a href="requisites.html" className="hover:text-brand-yellow transition-colors">Реквизиты</a></li>
                            <li><a href="vacancies.html" className="hover:text-brand-yellow transition-colors">Вакансии</a></li>
                        </ul>
                    </div>

                    {/* Contacts */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Контакты</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                                <span>Снежинск, ул. Комсомольская 3А<br />(Парк Культуры)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-green shrink-0" />
                                <a href="tel:+73514692211" className="hover:text-white transition-colors">+7 (351) 469-22-11</a>
                            </li>
                        </ul>

                        {/* Payment Methods Badge */}
                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <p className="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wider">Мы принимаем</p>
                            <div className="flex items-center gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                {/* Visa */}
                                <div className="h-6 bg-white rounded px-2 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 w-auto" alt="Visa" /></div>
                                {/* Mastercard */}
                                <div className="h-6 bg-white rounded px-2 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 w-auto" alt="Mastercard" /></div>
                                {/* Mir */}
                                <div className="h-6 bg-white rounded px-2 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.SVG.svg" className="h-3 w-auto" alt="Mir" /></div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>© 2025 Дача. Все права защищены.</p>
                    <div className="text-right">
                        <p>Разработано для людей</p>
                        <p className="text-gray-700 mt-1">Backend: {backendStatus}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';
import { Truck, Clock, MapPin, Award, Phone, Utensils, PartyPopper } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const InfoSection: React.FC = () => {
  return (
    <>
      {/* About & Features */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative">
                     <div className="absolute -top-4 -left-4 w-24 h-24 bg-dacha-gold/20 rounded-full blur-2xl"></div>
                     <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-dacha-green/10 rounded-full blur-2xl"></div>
                     <img 
                        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
                        alt="Interior" 
                        className="relative rounded-2xl shadow-xl w-full object-cover h-[400px]"
                     />
                     <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden md:block">
                        <p className="text-dacha-green font-serif text-lg italic">
                           "Место, где время течет медленнее, а еда вкуснее."
                        </p>
                     </div>
                </div>
                <div className="order-1 lg:order-2">
                    <h2 className="text-3xl font-serif font-bold text-dacha-dark mb-6">Кафе «Дача» — отдых для души</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Мы находимся в уютном уголке Снежинска и приглашаем вас отдохнуть от городской суеты. 
                        Наше меню сочетает в себе лучшие традиции русской домашней кухни и любимые европейские блюда.
                        Особая гордость — блюда на мангале, которые мы готовим на настоящих углях круглый год.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-dacha-green/10 rounded-lg text-dacha-green shrink-0">
                                <Utensils size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-dacha-dark">Бизнес-ланчи</h4>
                                <p className="text-sm text-gray-500">По будням с 12:00 до 16:00. Вкусно и недорого.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-dacha-green/10 rounded-lg text-dacha-green shrink-0">
                                <PartyPopper size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-dacha-dark">Банкеты и праздники</h4>
                                <p className="text-sm text-gray-500">Уютный зал для свадеб, юбилеев и корпоративов.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-dacha-green/10 rounded-lg text-dacha-green shrink-0">
                                <Award size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-dacha-dark">Высокое качество</h4>
                                <p className="text-sm text-gray-500">Только свежие продукты от проверенных поставщиков.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="py-20 bg-dacha-green text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
             <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,60.5,29.6C50.8,40.8,42.7,50.8,32.7,58.8C22.7,66.7,10.8,72.7,-0.5,73.6C-11.8,74.4,-24.1,70.2,-35.1,62.8C-46.1,55.4,-55.8,44.9,-63.9,32.9C-72,20.9,-78.5,7.5,-76.3,-5C-74.1,-17.5,-63.2,-29.1,-52.3,-38.4C-41.4,-47.7,-30.5,-54.7,-18.9,-63.6C-7.3,-72.5,4.9,-83.3,18.3,-82.5C31.7,-81.7,46.3,-69.3,44.7,-76.4Z" transform="translate(100 100)" />
             </svg>
         </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Доставка Еды</h2>
                <p className="text-white/80 max-w-2xl mx-auto">
                    Нет времени готовить? Привезем любимые блюда горячими к вам домой или в офис.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center hover:bg-white/20 transition-colors">
                    <div className="w-16 h-16 mx-auto bg-white text-dacha-green rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                        <Truck size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Условия</h3>
                    <p className="text-white/80">Бесплатная доставка при заказе от 1000 ₽. <br/>Стоимость доставки при заказе до 1000 ₽ — 100 ₽.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center hover:bg-white/20 transition-colors">
                    <div className="w-16 h-16 mx-auto bg-white text-dacha-green rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                        <Clock size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Время работы</h3>
                    <p className="text-white/80">Принимаем заказы на доставку <br/>ежедневно с 11:00 до 22:30.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center hover:bg-white/20 transition-colors">
                    <div className="w-16 h-16 mx-auto bg-white text-dacha-green rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                        <MapPin size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">География</h3>
                    <p className="text-white/80">Доставляем по всему городу Снежинск, включая отдаленные районы (КПП).</p>
                </div>
            </div>
         </div>
      </section>

      {/* Footer / Contacts Preview */}
      <footer id="contacts" className="bg-dacha-dark text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-serif text-2xl font-bold mb-4">Дача</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Вкусно, как дома. Уютно, как на даче.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">VK</a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer">TG</a>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-lg mb-4">Контакты</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li className="flex items-start gap-2">
                            <MapPin size={18} className="shrink-0 text-dacha-gold" />
                            {CONTACT_INFO.address}
                        </li>
                        <li className="flex items-center gap-2">
                             <Phone size={18} className="shrink-0 text-dacha-gold" />
                             <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors">{CONTACT_INFO.phone}</a>
                        </li>
                        <li className="flex items-center gap-2">
                             <span className="shrink-0 text-dacha-gold text-xs">@</span>
                             <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">{CONTACT_INFO.email}</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-4">Режим работы</h4>
                    <p className="text-gray-400 text-sm">{CONTACT_INFO.workHours}</p>
                    <p className="text-gray-500 text-xs mt-3">Бизнес-ланчи: Пн-Пт 12:00-16:00</p>
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-4">Информация</h4>
                    <ul className="space-y-2 text-xs text-gray-500">
                        <li><a href="#" className="hover:text-gray-300">Политика обработки данных</a></li>
                        <li><a href="#" className="hover:text-gray-300">Пользовательское соглашение</a></li>
                        <li className="pt-2">ИП Иванов И.И.</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Кафе «Дача» Снежинск. Все права защищены.
            </div>
        </div>
      </footer>
    </>
  );
};

export default InfoSection;
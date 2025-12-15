import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Utensils, Flame, Bike } from 'lucide-react';

interface HeroProps {
  onOrderClick: () => void;
  onOpenReservation: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOrderClick, onOpenReservation }) => {
  const [status, setStatus] = useState<{ isOpen: boolean, text: string }>({ isOpen: false, text: 'Загрузка...' });

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      // Open from 11:00 to 23:00
      if (hour >= 11 && hour < 23) {
        setStatus({ isOpen: true, text: 'Открыто сейчас' });
      } else {
        setStatus({ isOpen: false, text: 'Закрыто сейчас' });
      }
    };
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:pt-16 md:pb-12">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16">
        {/* LEFT: Typography & CTA */}
        <div className="flex-1 text-center md:text-left space-y-6 md:pr-8">
          {/* Status Badge */}
          <div id="status-badge" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold animate-[fadeIn_0.5s] ${status.isOpen ? 'bg-green-50 text-brand-green' : 'bg-red-50 text-red-600'}`}>
            <span className="relative flex h-2.5 w-2.5">
              {status.isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.isOpen ? 'bg-brand-green' : 'bg-red-600'}`}></span>
            </span>
            {status.text}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold tracking-tight text-brand-black leading-[1.1]">
            Дача<br />
            <span className="text-brand-black font-medium relative inline-block">
              для Друзей
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-yellow -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-500 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
            Настоящий шашлык на углях, домашние пельмени и горячая выпечка.
            Доставим по Снежинску за <span className="text-brand-black font-bold">~40 минут</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <button onClick={onOpenReservation} className="bg-brand-yellow hover:bg-[#F0D500] text-brand-black px-8 py-4 rounded-2xl font-bold text-lg shadow-glow transition-transform active:scale-95 flex items-center justify-center gap-2">
              <span>Забронировать столик</span>
              <CalendarDays className="w-5 h-5" />
            </button>
            <Link to="/lunch" className="bg-white border-2 border-brand-gray hover:border-brand-green text-brand-black px-8 py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 group">
              <Utensils className="w-5 h-5 text-gray-400 group-hover:text-brand-green transition-colors" />
              <span>Бизнес-ланч</span>
            </Link>
          </div>
        </div>

        {/* RIGHT: Floating Visual */}
        <div className="flex-1 w-full relative flex justify-center md:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-yellow/20 to-brand-green/10 rounded-full blur-3xl -z-10"></div>
          <div className="relative w-full max-w-[500px] aspect-square">
            <img src="/hero_ribs.jpg" alt="Delicious Ribs" className="w-full h-full object-cover rounded-[40px] shadow-2xl animate-float rotate-2" />
            <div className="absolute top-8 -left-4 md:-left-8 bg-white p-3 pr-5 rounded-2xl shadow-float animate-[float_5s_ease-in-out_1s_infinite] flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-xl text-orange-500"><Flame className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Хит продаж</p>
                <p className="font-bold text-sm">Свиные ребрышки</p>
              </div>
            </div>
            <div className="absolute -bottom-6 right-4 md:-right-4 bg-white p-3 pr-5 rounded-2xl shadow-float animate-[float_7s_ease-in-out_0.5s_infinite] flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-xl text-brand-green"><Bike className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Доставка</p>
                <p className="font-bold text-sm">Бесплатно</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
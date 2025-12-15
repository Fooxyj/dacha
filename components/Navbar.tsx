
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Utensils, UserCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  onOpenAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenReservation, onOpenAuth }) => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 h-[72px] flex items-center transition-all">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <span className="font-extrabold text-2xl tracking-tight text-brand-black">
            Дача <span className="font-medium text-brand-black">для Друзей</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/lunch" className="hidden md:flex bg-white border border-gray-200 hover:border-brand-green text-brand-black px-5 py-2.5 rounded-2xl font-medium text-sm transition-colors items-center gap-2">
            <Utensils className="w-4 h-4" />
            Бизнес-ланч
          </Link>

          {/* Auth Button */}
          {user ? (
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-brand-black hover:text-brand-green px-4 py-2 transition-colors"
            >
              <UserCircle className="w-5 h-5" />
              <span>{user.first_name || user.username}</span>
            </Link>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden md:flex items-center gap-2 text-sm font-bold text-brand-black hover:text-brand-green px-4 py-2 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span>Войти</span>
            </button>
          )}

          {/* Cart Button */}
          <button onClick={onOpenCart} className="relative bg-brand-yellow hover:brightness-105 text-brand-black px-4 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2">
            <span className="hidden sm:inline">Корзина</span>
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span id="cart-badge" className="bg-white text-brand-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] shadow-sm border border-gray-100">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
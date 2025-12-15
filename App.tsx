import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import BusinessLunchPage from './components/BusinessLunchPage';
import CartModal from './components/CartModal';
import ReservationModal from './components/ReservationModal';
import AuthModal from './components/AuthModal';
import ProfilePage from './components/ProfilePage';
import Footer from './components/Footer';
import { MenuItem, CartItem, Category } from './types';
import { AuthProvider } from './contexts/AuthContext';

import BanquetSection from './components/BanquetSection';

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Home Page Component
interface HomePageProps {
  addToCart: (item: MenuItem) => void;
  onOpenReservation: () => void;
}
const HomePage: React.FC<HomePageProps> = ({ addToCart, onOpenReservation }) => {
  const scrollToMenu = () => {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="flex-grow">
      <Hero onOrderClick={scrollToMenu} onOpenReservation={onOpenReservation} />
      <div id="menu">
        <MenuSection onAddToCart={addToCart} />
      </div>
      <BanquetSection />
    </main>
  );
};

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('dacha_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>('checking');

  // Backend Status Check
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/status/')
      .then(res => res.json())
      .then(data => setBackendStatus(data.status))
      .catch(() => setBackendStatus('error'));
  }, []);


  // Save cart
  useEffect(() => {
    localStorage.setItem('dacha_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    // Remove auto-open
    // setIsCartOpen(true); 
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="font-sans text-brand-black bg-white min-h-screen flex flex-col">
          <Navbar
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenReservation={() => setIsReservationOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />

          {/* Spacer for fixed navbar */}
          <div className="h-[72px]"></div>

          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} onOpenReservation={() => setIsReservationOpen(true)} />} />
            <Route path="/lunch" element={<BusinessLunchPage />} />
            <Route path="/lunch.html" element={<BusinessLunchPage />} /> {/* Backward compatibility */}
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>

          <Footer backendStatus={backendStatus} />

          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
          />

          <ReservationModal
            isOpen={isReservationOpen}
            onClose={() => setIsReservationOpen(false)}
          />

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
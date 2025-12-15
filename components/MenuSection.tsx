import React, { useState, useMemo, useEffect } from 'react';
import { Category, MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'ALL'>('ALL');
  const [isSticky, setIsSticky] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch Menu Data
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/menu/')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
        setProducts(data.products);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch menu:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setIsSticky(true);
      else setIsSticky(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategoryId === 'ALL') {
      return products;
    }
    return products.filter(item => item.category === activeCategoryId);
  }, [activeCategoryId, products]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const grid = document.getElementById('menu-grid');
    if (grid) {
      // Offset for sticky header
      const y = grid.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Загрузка меню...</div>;
  }

  return (
    <>
      {/* Sticky Categories */}
      <div id="sticky-nav" className={`sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4 mt-4 transition-shadow ${isSticky ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2"
            id="categories-container"
          >
            <button
              onClick={() => setActiveCategoryId('ALL')}
              className={`snap-start shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap ${activeCategoryId === 'ALL'
                ? 'bg-brand-black text-white'
                : 'bg-brand-gray text-gray-600 hover:bg-gray-200'
                }`}
            >
              Все
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`snap-start shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap ${activeCategoryId === cat.id
                  ? 'bg-brand-black text-white'
                  : 'bg-brand-gray text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" id="menu-grid">
          {currentItems.map((item) => (
            <div key={item.id} className="menu-item flex flex-col h-full group">
              <div
                className="relative bg-brand-gray rounded-[24px] overflow-hidden aspect-[4/3] mb-4"
              >
                <img
                  src={item.image ? `http://127.0.0.1:8000${item.image}` : '/placeholder.jpg'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={item.title}
                />
                {item.popular && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                    <span className="text-orange-500">🔥</span> Хит
                  </div>
                )}
                <button
                  onClick={() => onAddToCart(item)}
                  className="absolute bottom-3 right-3 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 hidden md:flex hover:bg-brand-yellow text-brand-black"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-2xl font-bold text-brand-black group-hover:text-brand-green transition-colors">
                    {item.price} ₽
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-tight mb-2 text-brand-black">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>
                <button
                  onClick={() => onAddToCart(item)}
                  className="mt-auto w-full md:hidden bg-brand-gray py-3 rounded-xl font-bold text-sm text-brand-black active:scale-95 transition-transform"
                >
                  Добавить
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-12">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 rounded-lg bg-gray-100 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === page
                  ? 'bg-brand-black text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 rounded-lg bg-gray-100 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              →
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default MenuSection;
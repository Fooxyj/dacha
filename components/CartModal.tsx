import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Banknote, Loader2, MapPin } from 'lucide-react';
import { CartItem } from '../types';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';
import { API_URL, getImageUrl } from '../config';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

interface Address {
  id: number;
  address: string;
  is_default: boolean;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'card',
    delivery: 'delivery',
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = (formData.delivery === 'delivery' && itemsTotal < 1000) ? 150 : 0;
  const total = itemsTotal + deliveryCost;

  // Auto-fill user data
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        name: user.first_name || user.username,
        phone: user.username,
      }));
    }
  }, [isOpen, user]);



  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && value[0] !== '7') {
      value = '7' + value;
    }
    value = value.substring(0, 11);

    let formattedValue = '';
    if (value.length > 0) formattedValue += '+7';
    if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
    if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
    if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
    if (value.length > 9) formattedValue += '-' + value.substring(9, 11);

    setFormData({ ...formData, phone: formattedValue });
  };

  const handleCheckout = async () => {
    if (!formData.name || !formData.phone || (formData.delivery === 'delivery' && !formData.address)) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.delivery === 'pickup' ? 'Самовывоз' : formData.address,
        total_price: total,
        payment_method: formData.payment,
        items: JSON.stringify(items.map(item => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price
        }))),
        status: 'new'
      };

      const getCookie = (name: string) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
            }
          }
        }
        return cookieValue;
      };

      const csrftoken = getCookie('csrftoken');

      const response = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken || '',
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        if (formData.payment === 'online' && data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          setIsSuccess(true);
          onClearCart();
        }
      } else {
        setError(data.error || 'Ошибка при отправке заказа. Попробуйте позже.');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">🎉</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Заказ принят!</h2>
          <p className="text-gray-500 mb-8">
            Мы уже начали готовить.<br />
            Скоро свяжемся с вами.
          </p>
          <button
            onClick={() => { setIsSuccess(false); onClose(); }}
            className="w-full bg-brand-yellow hover:brightness-105 text-brand-black py-4 rounded-xl font-bold shadow-float active:scale-95 transition-all"
          >
            Отлично
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Корзина <span className="text-gray-400 font-medium text-sm">({items.length})</span>
            </h2>
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Доставка с 11:00 до 23:00
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 text-4xl">🛒</div>
              <p className="font-medium text-lg">В корзине пусто</p>
              <p className="text-sm text-gray-400 max-w-[200px]">Добавьте что-нибудь вкусное из меню</p>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={getImageUrl(item.image)} alt={item.title} className="w-20 h-20 object-cover rounded-xl bg-gray-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm leading-tight mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-400">{item.weight}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-bold">{item.price * item.quantity} ₽</div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:text-red-500 transition-colors">
                            {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                          </button>
                          <span className="text-xs font-bold w-3 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:text-green-500 transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Info Block */}
              {formData.delivery === 'delivery' && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-sm text-orange-800">
                  <p className="font-bold mb-1">Условия доставки:</p>
                  <ul className="list-disc list-inside space-y-1 text-orange-700/80">
                    <li>Бесплатно при заказе от 1000 ₽</li>
                    <li>До 1000 ₽ — доставка 150 ₽</li>
                    <li>Работаем с 11:00 до 23:00 без выходных</li>
                  </ul>
                </div>
              )}

              {/* Checkout Form */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h3 className="font-bold text-lg">Оформление заказа</h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Ваше имя"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 focus:border-transparent outline-none transition-all"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Телефон +7 (___) ___-__-__"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 focus:border-transparent outline-none transition-all font-mono text-sm"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />

                  {/* Delivery Method */}
                  <div className="flex bg-gray-50 p-1 rounded-xl">
                    <button
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.delivery === 'delivery' ? 'bg-white shadow-sm text-brand-black' : 'text-gray-400'}`}
                      onClick={() => setFormData({ ...formData, delivery: 'delivery' })}
                    >
                      Доставка
                    </button>
                    <button
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.delivery === 'pickup' ? 'bg-white shadow-sm text-brand-black' : 'text-gray-400'}`}
                      onClick={() => setFormData({ ...formData, delivery: 'pickup' })}
                    >
                      Самовывоз
                    </button>
                  </div>

                  {/* Address Selection */}
                  {formData.delivery === 'delivery' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="address"
                        placeholder="Адрес доставки (Улица, дом, квартира)"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 focus:border-transparent outline-none transition-all"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-brand-black">Оплата</h3>
                  <div className="flex flex-col gap-2">
                    <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors ${formData.payment === 'online' ? 'bg-brand-yellow/10 border border-brand-yellow' : 'bg-brand-gray'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={formData.payment === 'online'}
                        onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                        className="w-5 h-5 text-brand-black accent-brand-black"
                      />
                      <CreditCard className="w-5 h-5 text-brand-black" />
                      <div>
                        <div className="font-medium text-brand-black">Оплата на сайте</div>
                        <div className="text-xs text-gray-500">PayKeeper (Visa, MC, Mir)</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors ${formData.payment === 'transfer' ? 'bg-brand-yellow/10 border border-brand-yellow' : 'bg-brand-gray'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        checked={formData.payment === 'transfer'}
                        onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                        className="w-5 h-5 text-brand-black accent-brand-black"
                      />
                      <Banknote className="w-5 h-5 text-brand-black" />
                      <span className="font-medium text-brand-black">Карта / Перевод</span>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors ${formData.payment === 'cash' ? 'bg-brand-yellow/10 border border-brand-yellow' : 'bg-brand-gray'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={formData.payment === 'cash'}
                        onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                        className="w-5 h-5 text-brand-black accent-brand-black"
                      />
                      <Banknote className="w-5 h-5 text-brand-black" />
                      <span className="font-medium text-brand-black">Наличными при получении</span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>Сумма заказа:</span>
                <span>{itemsTotal} ₽</span>
              </div>
              {formData.delivery === 'delivery' && (
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <span>Доставка:</span>
                  <span>{deliveryCost > 0 ? `${deliveryCost} ₽` : 'Бесплатно'}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-2 border-t border-dashed border-gray-200">
                <span className="text-gray-900 font-bold">Итого:</span>
                <span className="text-2xl font-extrabold text-brand-black">{total} ₽</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-brand-yellow hover:brightness-105 text-brand-black py-4 rounded-2xl font-bold text-lg shadow-float active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Отправка...
                </>
              ) : (
                'Оформить заказ'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
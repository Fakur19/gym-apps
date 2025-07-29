import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const PosView = () => {
  const { t } = useTranslation();
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await axios.get('/foods');
      setFoods(data.data);
    } catch (error) {
      showToast(t('error_fetching_foods'), 'error');
    }
  };

  const addToCart = (food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.foodId === food._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.foodId === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { foodId: food._id, name: food.name, price: food.price, quantity: 1 }];
    });
  };

  const removeFromCart = (foodId) => {
    setCart((prevCart) => prevCart.filter((item) => item.foodId !== foodId));
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity < 1) {
      removeFromCart(foodId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.foodId === foodId ? { ...item, quantity } : item))
    );
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    try {
      await axios.post('/sales', { items: cart });
      showToast(t('sale_completed_success'), 'success');
      setCart([]);
      fetchFoods(); // Refetch foods to update stock
    } catch (error) {
      showToast(error.response?.data?.error || t('error_completing_sale'), 'error');
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t('point_of_sale')}</h1>
          <input
            type="text"
            placeholder={t('search_products')}
            className="p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredFoods.map((food) => (
            <div
              key={food._id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-200"
              onClick={() => addToCart(food)}
            >
              <h3 className="font-bold">{food.name}</h3>
              <p>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(food.price)}</p>
              <p>{t('stock')}: {food.stock}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">{t('cart')}</h1>
        <div className="bg-white p-4 rounded">
          {cart.length === 0 ? (
            <p>{t('no_items_in_cart')}</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.foodId} className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.foodId, parseInt(e.target.value))}
                      className="w-16 p-1 border rounded mx-2"
                    />
                    <button onClick={() => removeFromCart(item.foodId)} className="text-red-500">
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-xl">
                <span>{t('total')}:</span>
                <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(getTotal())}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white p-2 rounded w-full mt-4"
              >
                {t('checkout')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosView;

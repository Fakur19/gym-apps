import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const FoodManagementView = () => {
  const { t } = useTranslation();
  const [foods, setFoods] = useState([]);
  const [food, setFood] = useState({ name: '', price: '', stock: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentFoodId, setCurrentFoodId] = useState(null);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await axios.put(`/foods/${currentFoodId}`, food);
        showToast(t('food_updated_success'), 'success');
      } catch (error) {
        showToast(t('error_updating_food'), 'error');
      }
    } else {
      try {
        await axios.post('/foods', food);
        showToast(t('food_added_success'), 'success');
      } catch (error) {
        showToast(t('error_adding_food'), 'error');
      }
    }
    resetForm();
    fetchFoods();
  };

  const handleEdit = (food) => {
    setIsEditing(true);
    setCurrentFoodId(food._id);
    setFood({ name: food.name, price: food.price, stock: food.stock });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/foods/${id}`);
      showToast(t('food_deleted_success'), 'success');
      fetchFoods();
    } catch (error) {
      showToast(t('error_deleting_food'), 'error');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentFoodId(null);
    setFood({ name: '', price: '', stock: '' });
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('food_bev_management')}</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={food.name}
            onChange={handleInputChange}
            placeholder={t('food_name')}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
          <input
            type="number"
            name="price"
            value={food.price}
            onChange={handleInputChange}
            placeholder={t('price')}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
          <input
            type="number"
            name="stock"
            value={food.stock}
            onChange={handleInputChange}
            placeholder={t('stock')}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">
            {isEditing ? t('update_food') : t('add_food')}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 rounded">
              {t('cancel')}
            </button>
          )}
        </div>
      </form>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{t('current_inventory')}</h2>
          <input
            type="text"
            placeholder={t('search_by_name')}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('price')}</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('stock')}</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFoods.map((food) => (
                <tr key={food._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{food.name}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(food.price)}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 text-right">{food.stock}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <button onClick={() => handleEdit(food)} className="text-blue-500 mr-2">
                      {t('edit')}
                    </button>
                    <button onClick={() => handleDelete(food._id)} className="text-red-500">
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FoodManagementView;

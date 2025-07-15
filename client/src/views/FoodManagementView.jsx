import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const FoodManagementView = () => {
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
      showToast('Error fetching foods', 'error');
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
        showToast('Food item updated successfully', 'success');
      } catch (error) {
        showToast('Error updating food item', 'error');
      }
    } else {
      try {
        await axios.post('/foods', food);
        showToast('Food item added successfully', 'success');
      } catch (error) {
        showToast('Error adding food item', 'error');
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
      showToast('Food item deleted successfully', 'success');
      fetchFoods();
    } catch (error) {
      showToast('Error deleting food item', 'error');
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
      <h1 className="text-2xl font-bold mb-4">Food Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={food.name}
            onChange={handleInputChange}
            placeholder="Food Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={food.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="stock"
            value={food.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            className="p-2 border rounded"
            required
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">
            {isEditing ? 'Update Food' : 'Add Food'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Food List</h2>
          <input
            type="text"
            placeholder="Search by name..."
            className="p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Stock</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.map((food) => (
                <tr key={food._id}>
                  <td className="py-2 px-4 border-b">{food.name}</td>
                  <td className="py-2 px-4 border-b">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(food.price)}</td>
                  <td className="py-2 px-4 border-b">{food.stock}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEdit(food)} className="text-blue-500 mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(food._id)} className="text-red-500">
                      Delete
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

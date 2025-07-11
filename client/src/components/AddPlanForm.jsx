import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const AddPlanForm = ({ onPlanAdded }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const planData = {
      name,
      durationInMonths: parseInt(duration),
      price: parseInt(price)
    };
    try {
      await onPlanAdded(planData);
      showToast('Membership plan added successfully!', 'success');
      setName('');
      setDuration('');
      setPrice('');
    } catch (error) {
      showToast(error.response?.data?.msg || 'Failed to add membership plan.', 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-fit">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plan-name" className="block text-sm font-medium text-gray-600 mb-1">Plan Name</label>
          <input type="text" id="plan-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Gold (6 Months)" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label htmlFor="plan-duration" className="block text-sm font-medium text-gray-600 mb-1">Duration (in Months)</label>
          <input type="number" id="plan-duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 6 (0 for single visit)" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required min="0" />
        </div>
        <div>
          <label htmlFor="plan-price" className="block text-sm font-medium text-gray-600 mb-1">Price (IDR)</label>
          <input type="number" id="plan-price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 1200000" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required min="0" />
        </div>
        <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">Add Plan</button>
      </form>
    </div>
  );
};

export default AddPlanForm;
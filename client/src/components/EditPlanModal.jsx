import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const EditPlanModal = ({ plan, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', durationInMonths: '', price: '' });
  const { showToast } = useToast();

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        durationInMonths: plan.durationInMonths,
        price: plan.price
      });
    }
  }, [plan]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(plan._id, formData);
      showToast('Membership plan updated successfully!', 'success');
      onClose();
    } catch (error) {
      showToast(error.response?.data?.msg || 'Failed to update membership plan.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Edit Membership Plan</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="edit-plan-name" className="block text-sm font-medium text-gray-700">Plan Name</label>
              <input type="text" id="edit-plan-name" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label htmlFor="edit-plan-duration" className="block text-sm font-medium text-gray-700">Duration (in Months)</label>
              <input type="number" id="edit-plan-duration" name="durationInMonths" value={formData.durationInMonths} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" required min="0" />
            </div>
            <div>
              <label htmlFor="edit-plan-price" className="block text-sm font-medium text-gray-700">Price (IDR)</label>
              <input type="number" id="edit-plan-price" name="price" value={formData.price} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" required min="0" />
            </div>
            <div className="items-center px-4 py-3 space-y-2">
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700">Save Changes</button>
              <button type="button" onClick={onClose} className="w-full px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPlanModal;
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';

const EditPlanModal = ({ plan, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
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
      showToast(t('update_plan_success'), 'success');
      onClose();
    } catch (error) {
      showToast(error.response?.data?.msg || t('update_plan_error'), 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">{t('edit_plan')}</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="edit-plan-name" className="block text-sm font-medium text-gray-700">{t('plan_name')}</label>
              <input type="text" id="edit-plan-name" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label htmlFor="edit-plan-duration" className="block text-sm font-medium text-gray-700">{t('duration_months')}</label>
              <input type="number" id="edit-plan-duration" name="durationInMonths" value={formData.durationInMonths} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" required min="0" />
            </div>
            <div>
              <label htmlFor="edit-plan-price" className="block text-sm font-medium text-gray-700">{t('price_idr')}</label>
              <input type="number" id="edit-plan-price" name="price" value={formData.price} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" required min="0" />
            </div>
            <div className="items-center px-4 py-3 space-y-2">
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700">{t('save_changes')}</button>
              <button type="button" onClick={onClose} className="w-full px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400">{t('cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPlanModal;
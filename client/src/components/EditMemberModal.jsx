import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';

const EditMemberModal = ({ isOpen, onClose, onSave, member }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const { showToast } = useToast();

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone || '',
      });
    }
  }, [member]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(member._id, formData);
      showToast(t('member_updated_success'), 'success');
      onClose();
    } catch (error) {
      showToast(error.response?.data?.msg || t('member_updated_error'), 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">{t('edit_member')}</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">{t('full_name')}</label>
              <input type="text" id="edit-name" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">{t('email_address')}</label>
              <input type="email" id="edit-email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">{t('phone_number')}</label>
              <input type="tel" id="edit-phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
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

export default EditMemberModal;
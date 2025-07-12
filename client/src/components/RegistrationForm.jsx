import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const RegistrationForm = ({ plans, onMemberAdded }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', planId: '' });
  const { showToast } = useToast();

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.planId) {
      showToast('Please select a membership plan.', 'error');
      return;
    }
    try {
      await onMemberAdded(formData);
      // The success toast is now handled by the parent component.
      setFormData({ name: '', email: '', phone: '', planId: '' }); // Reset form on success
    } catch (error) {
      // The error toast is now handled by the parent.
      // The form no longer needs to show its own error toast.
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-fit">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">New Member Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input type="email"  placeholder="Optional" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="planId" className="block text-sm font-medium text-gray-600 mb-1">Plan</label>
          <select id="planId" name="planId" value={formData.planId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="" disabled>Select a plan</option>
            {plans.map(plan => (
              <option key={plan._id} value={plan._id}>
                {plan.name} - {formatCurrency(plan.price)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
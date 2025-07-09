import { useState, useEffect } from 'react';

const RenewMemberModal = ({ isOpen, onClose, onSave, member, plans }) => {
  const [selectedPlanId, setSelectedPlanId] = useState('');

  useEffect(() => {
    if (plans && plans.length > 0) {
      setSelectedPlanId(plans[0]._id);
    }
  }, [plans]);

  if (!isOpen) return null;

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  const handleSave = () => {
    onSave(member._id, selectedPlanId);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Renew Membership</h3>
          <p className="text-sm text-gray-500 mt-1">For: {member?.name}</p>
          <div className="mt-4">
            <label htmlFor="renewalPlanId" className="block text-sm font-medium text-gray-700 mb-1">New Membership Plan</label>
            <select
              id="renewalPlanId"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {plans.map(plan => (
                <option key={plan._id} value={plan._id}>
                  {plan.name} - {formatCurrency(plan.price)}
                </option>
              ))}
            </select>
          </div>
          <div className="items-center px-4 py-3 space-y-2">
            <button onClick={handleSave} className="w-full px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700">Confirm Renewal</button>
            <button onClick={onClose} className="w-full px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewMemberModal;
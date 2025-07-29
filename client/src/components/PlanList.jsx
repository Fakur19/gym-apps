import { useTranslation } from 'react-i18next';

const PlanList = ({ plans, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  const getDurationText = (duration) => {
    if (duration === 0) {
      return t('single_visit');
    }
    if (duration < 1) {
      return `${duration * 30} ${t('duration_in_days')}`;
    }
    return `${duration} ${t('duration_in_months')}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{t('current_plans')}</h2>
      <div className="space-y-3">
        {plans.length > 0 ? (
          plans.map(plan => (
            <div key={plan._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
              <div>
                <p className="font-semibold text-gray-800">{plan.name}</p>
                <p className="text-sm text-gray-600">{t('duration')}: {getDurationText(plan.durationInMonths)} | {t('price')}: {formatCurrency(plan.price)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(plan)} className="px-3 py-1 text-xs rounded text-white bg-yellow-500 hover:bg-yellow-600">{t('edit')}</button>
                <button onClick={() => onDelete(plan._id)} className="px-3 py-1 text-xs rounded text-white bg-red-500 hover:bg-red-600">{t('delete')}</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">{t('no_plans_found')}</p>
        )}
      </div>
    </div>
  );
};

export default PlanList;
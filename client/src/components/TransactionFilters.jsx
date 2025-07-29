import { useTranslation } from 'react-i18next';

const TransactionFilters = ({ onFilterChange }) => {
  const { t } = useTranslation();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const handleFilterChange = () => {
    const month = document.getElementById('month-filter').value;
    const year = document.getElementById('year-filter').value;
    onFilterChange({ month, year });
  };

  return (
    <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
      <h2 className="text-xl font-semibold text-gray-700">{t('all_transactions')}</h2>
      <div className="flex items-center gap-2 md:gap-4">
        <select id="month-filter" defaultValue={currentMonth} onChange={handleFilterChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
          {t('months', { returnObjects: true }).map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
        <select id="year-filter" defaultValue={currentYear} onChange={handleFilterChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
          {[...Array(5)].map((_, i) => (
            <option key={i} value={currentYear - i}>{currentYear - i}</option>
          ))}
        </select>
        </div>
    </div>
  );
};

export default TransactionFilters;
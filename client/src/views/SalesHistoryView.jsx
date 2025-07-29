import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const SalesHistoryView = () => {
  const { t } = useTranslation();
  const [sales, setSales] = useState([]);
  const [filters, setFilters] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const { data } = await axios.get('/sales');
      setSales(data.data);
    } catch (error) {
      showToast(t('error_fetching_sales'), 'error');
    }
  };

  const filteredSales = useMemo(() => {
    const filtered = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.getMonth() === parseInt(filters.month) && saleDate.getFullYear() === parseInt(filters.year);
    });
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [sales, filters]);

  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t('sales_history')}</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <select 
              id="month-filter" 
              defaultValue={filters.month} 
              onChange={(e) => handleFilterChange({ ...filters, month: e.target.value })} 
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 text-sm block"
            >
              {t('months', { returnObjects: true }).map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select 
              id="year-filter" 
              defaultValue={filters.year} 
              onChange={(e) => handleFilterChange({ ...filters, year: e.target.value })} 
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 text-sm block"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('items')}</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString()}</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      <ul>
                        {sale.items.map((item) => (
                          <li key={item._id}>
                            {item.food.name} - {item.quantity} @ {formatCurrency(item.price)}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">{formatCurrency(sale.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    {t('no_sales_found')}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td colSpan="2" className="py-3 px-4 text-right text-base font-semibold text-gray-700">{t('total_amount')}:</td>
                <td className="py-3 px-4 text-right text-base font-bold text-blue-600">{formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
  );
};

export default SalesHistoryView;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const SalesHistoryView = () => {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'day', 'week', 'month'
  const { showToast } = useToast();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const { data } = await axios.get('/sales');
      setSales(data.data);
    } catch (error) {
      showToast('Error fetching sales history', 'error');
    }
  };

  const getFilteredSales = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case 'day':
        return sales.filter(sale => new Date(sale.createdAt) >= today);
      case 'week':
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return sales.filter(sale => new Date(sale.createdAt) >= oneWeekAgo);
      case 'month':
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return sales.filter(sale => new Date(sale.createdAt) >= firstDayOfMonth);
      default:
        return sales;
    }
  };

  const filteredSales = getFilteredSales();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales History</h1>
        <div className="flex space-x-2">
          <button onClick={() => setFilter('all')} className={`p-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>All</button>
          <button onClick={() => setFilter('day')} className={`p-2 rounded ${filter === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Day</button>
          <button onClick={() => setFilter('week')} className={`p-2 rounded ${filter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Week</button>
          <button onClick={() => setFilter('month')} className={`p-2 rounded ${filter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Month</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Items</th>
              <th className="py-2 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale._id}>
                <td className="py-2 px-4 border-b">{new Date(sale.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                  <ul>
                    {sale.items.map((item) => (
                      <li key={item._id}>
                        {item.food.name} - {item.quantity} @ {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4 border-b">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(sale.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesHistoryView;

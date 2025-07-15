import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const SalesHistoryView = () => {
  const [sales, setSales] = useState([]);
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sales History</h1>
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
            {sales.map((sale) => (
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

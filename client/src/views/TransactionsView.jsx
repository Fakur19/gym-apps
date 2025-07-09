import { useState, useEffect, useMemo } from 'react';
import { getTransactions } from '../services/api';
import TransactionFilters from '../components/TransactionFilters';
import TransactionTable from '../components/TransactionTable';

const TransactionsView = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const response = await getTransactions();
        setAllTransactions(response.data);
      } catch (err) {
        setError('Failed to load transactions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const transactionDate = new Date(t.transactionDate);
      return transactionDate.getMonth() === parseInt(filters.month) && transactionDate.getFullYear() === parseInt(filters.year);
    });
  }, [allTransactions, filters]);

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      alert('No data to export for the selected period.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Time,Member Name,Description,Invoice #,Amount (IDR)\r\n";

    filteredTransactions.forEach(t => {
        const date = new Date(t.transactionDate);
        const formattedDate = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const formattedTime = date.toLocaleTimeString('en-GB');
        const invoiceNum = t._id.slice(-6).toUpperCase();
        const row = [formattedDate, formattedTime, `"${t.memberName}"`, `"${t.planName}"`, invoiceNum, t.amount].join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const monthName = new Date(filters.year, filters.month).toLocaleString('en-US', { month: 'long' });
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions-report-${monthName}-${filters.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transaction Log</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <TransactionFilters onFilterChange={setFilters} onExport={handleExport} />
        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default TransactionsView;
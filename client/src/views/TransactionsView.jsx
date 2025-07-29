import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTransactions } from '../services/api';
import TransactionFilters from '../components/TransactionFilters';
import TransactionTable from '../components/TransactionTable';
import Spinner from '../components/Spinner';

const TransactionsView = () => {
  const { t } = useTranslation();
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
        setError(t('no_transactions_found'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [t]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const transactionDate = new Date(t.transactionDate);
      return transactionDate.getMonth() === parseInt(filters.month) && transactionDate.getFullYear() === parseInt(filters.year);
    });
  }, [allTransactions, filters]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('transactions')}</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <TransactionFilters onFilterChange={setFilters} />
        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default TransactionsView;
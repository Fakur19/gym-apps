import { useTranslation } from 'react-i18next';

const TransactionTable = ({ transactions }) => {
  const { t } = useTranslation();
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date_time')}</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('member_name')}</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('description')}</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('invoice_no')}</th>
            <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map(t => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.transactionDate).toLocaleString('en-GB')}</td>
                <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{t.memberName}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{t.planName}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{t._id.slice(-6).toUpperCase()}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">{formatCurrency(t.amount)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                {t('no_transactions_found_period')}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100">
            <td colSpan="4" className="py-3 px-4 text-right text-base font-semibold text-gray-700">{t('total_amount')}:</td>
            <td className="py-3 px-4 text-right text-base font-bold text-blue-600">{formatCurrency(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;
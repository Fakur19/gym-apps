const TransactionTable = ({ transactions }) => {
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
            <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
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
              <td colSpan="5" className="text-center py-4 text-gray-500">No transactions found for this period.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
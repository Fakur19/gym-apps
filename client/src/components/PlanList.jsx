const PlanList = ({ plans, onEdit, onDelete }) => {
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Membership Plans</h2>
      <div className="space-y-3">
        {plans.length > 0 ? (
          plans.map(plan => (
            <div key={plan._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
              <div>
                <p className="font-semibold text-gray-800">{plan.name}</p>
                <p className="text-sm text-gray-600">Duration: {plan.durationInMonths} months | Price: {formatCurrency(plan.price)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(plan)} className="px-3 py-1 text-xs rounded text-white bg-yellow-500 hover:bg-yellow-600">Edit</button>
                <button onClick={() => onDelete(plan._id)} className="px-3 py-1 text-xs rounded text-white bg-red-500 hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No plans found. Add one to get started.</p>
        )}
      </div>
    </div>
  );
};

export default PlanList;
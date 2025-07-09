const KpiCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-5">
      <div className="rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default KpiCard;
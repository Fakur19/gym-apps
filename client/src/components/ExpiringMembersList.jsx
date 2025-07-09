const ExpiringMembersList = ({ members }) => {
  if (!members || members.length === 0) {
    return <p className="text-gray-500 text-center">No memberships are expiring in the next 7 days.</p>;
  }

  return (
    <div className="space-y-3">
      {members.map(member => (
        <div key={member._id} className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div>
            <p className="font-semibold text-gray-800">{member.name}</p>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-red-600">Expires</p>
            <p className="text-sm text-red-500">{new Date(member.membership.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpiringMembersList;
const MemberTable = ({ members, onAction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.length > 0 ? (
            members.map(member => (
              <tr key={member._id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{member.name}</div>
                  {/* <div className="text-sm text-gray-500">{member.email}</div> */}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(member.membership.endDate).toLocaleDateString('en-GB')}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.membership.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {member.membership.status}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => onAction('checkin', member)} disabled={member.hasCheckedIn} className="px-3 py-1 text-xs rounded text-white bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400">
                      {member.hasCheckedIn ? 'Checked-in' : 'Check-in'}
                    </button>
                    <button onClick={() => onAction('renew', member)} className="px-3 py-1 text-xs rounded text-white bg-green-500 hover:bg-green-600">Renew</button>
                    <button onClick={() => onAction('edit', member)} className="px-3 py-1 text-xs rounded text-white bg-yellow-500 hover:bg-yellow-600">Edit</button>
                    <button onClick={() => onAction('print', member)} className="px-3 py-1 text-xs rounded text-white bg-blue-500 hover:bg-blue-600">Print</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No members found. Register a new member to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
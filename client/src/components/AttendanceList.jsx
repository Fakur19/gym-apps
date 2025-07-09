const AttendanceList = ({ checkins }) => {
  const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Today's Attendance</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {!checkins || checkins.length === 0 ? (
          <p className="text-gray-500 text-center">No check-ins yet today.</p>
        ) : (
          checkins.slice(0, 5).map(checkin => (
            <div key={checkin._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="font-medium text-gray-800">{checkin.memberName}</span>
              <span className="text-sm text-gray-500">{formatTime(checkin.checkInTime)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceList;
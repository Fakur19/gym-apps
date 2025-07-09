import { FaTachometerAlt, FaUsers, FaFileInvoiceDollar, FaCogs } from 'react-icons/fa';

const NavLink = ({ id, icon, text, activeView, onClick }) => {
  const isActive = activeView === id;
  const baseClasses = "flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-gray-300";
  const activeClasses = "bg-blue-600 text-white font-semibold";
  const inactiveClasses = "hover:bg-gray-700 hover:text-white";

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(id);
      }}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      {text}
    </a>
  );
};

const Sidebar = ({ setActiveView, activeView }) => {
  const navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <FaTachometerAlt className="w-5 h-5 mr-3" /> },
    { id: 'members', text: 'Members', icon: <FaUsers className="w-5 h-5 mr-3" /> },
    { id: 'transactions', text: 'Transactions', icon: <FaFileInvoiceDollar className="w-5 h-5 mr-3" /> },
    { id: 'admin', text: 'Admin', icon: <FaCogs className="w-5 h-5 mr-3" /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 bg-gray-900">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <span className="ml-3 text-xl font-semibold text-white">GymPro</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(item => (
          <NavLink 
            key={item.id}
            id={item.id}
            icon={item.icon}
            text={item.text}
            activeView={activeView}
            onClick={setActiveView}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
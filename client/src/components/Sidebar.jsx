import { FaTachometerAlt, FaUsers, FaFileInvoiceDollar, FaCogs, FaChevronLeft, FaChevronRight, FaSignOutAlt } from 'react-icons/fa';

const NavLink = ({ id, icon, text, activeView, onClick, isCollapsed }) => {
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
      <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-3'}`}>
        {text}
      </span>
    </a>
  );
};

const Sidebar = ({ setActiveView, activeView, isCollapsed, setIsCollapsed, handleLogout, userRole }) => {
  const navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <FaTachometerAlt className="w-5 h-5 flex-shrink-0" /> },
    { id: 'members', text: 'Members', icon: <FaUsers className="w-5 h-5 flex-shrink-0" /> },
    { id: 'transactions', text: 'Transactions', icon: <FaFileInvoiceDollar className="w-5 h-5 flex-shrink-0" /> },
  ];

  if (userRole === 'admin') {
    navItems.push({ id: 'admin', text: 'Admin', icon: <FaCogs className="w-5 h-5 flex-shrink-0" /> });
  }

  return (
    <aside className={`bg-gray-800 text-gray-300 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-center px-4 bg-gray-900">
        <img 
          src="/g2.png" 
          alt="GymBroS logo" 
          className="h-8 w-auto" // Adjust height as needed
        />
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
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="px-2 py-4">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white mb-2"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-3'}`}>
            Logout
          </span>
        </button>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          {isCollapsed ? <FaChevronRight className="w-5 h-5" /> : <FaChevronLeft className="w-5 h-5 mr-3" />}
          <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
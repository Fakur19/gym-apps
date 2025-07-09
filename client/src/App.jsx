import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import MembersView from './views/MembersView';
import TransactionsView from './views/TransactionsView';
import AdminView from './views/AdminView';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // New state for sidebar

  const handleNavigate = (view) => {
    setActiveView(view);
  };

  return (
    <div className="flex h-screen bg-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar 
        setActiveView={handleNavigate} 
        activeView={activeView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6">
          {/* Header content can go here */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* The renderView function will now be inside the return statement */}
          {(() => {
            switch (activeView) {
              case 'dashboard':
                return <DashboardView />;
              case 'members':
                return <MembersView onNavigate={() => {}} />;
              case 'transactions':
                return <TransactionsView />;
              case 'admin':
                return <AdminView />;
              default:
                return <DashboardView />;
            }
          })()}
        </main>
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import MembersView from './views/MembersView';
import TransactionsView from './views/TransactionsView';
import AdminView from './views/AdminView';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'members':
        return <MembersView />;
      case 'transactions':
        return <TransactionsView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar setActiveView={setActiveView} activeView={activeView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6">
          {/* Header content can go here */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
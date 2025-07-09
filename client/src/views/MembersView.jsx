import { useState, useEffect, useMemo } from 'react';
import { getMembers, getPlans, getTodaysCheckins, addMember, updateMember, renewMember, createCheckin } from '../services/api';
import RegistrationForm from '../components/RegistrationForm';
import AttendanceList from '../components/AttendanceList';
import MemberTable from '../components/MemberTable';
import RenewMemberModal from '../components/RenewMemberModal';
import EditMemberModal from '../components/EditMemberModal';

const MembersView = ({ onNavigate }) => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const membersPerPage = 10;

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [membersRes, plansRes, checkinsRes] = await Promise.all([
        getMembers(),
        getPlans(),
        getTodaysCheckins()
      ]);
      setMembers(membersRes.data);
      setPlans(plansRes.data);
      setCheckins(checkinsRes.data);
    } catch (err) {
      setError('Failed to load data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Memoized calculation for filtering and pagination
  const paginatedMembers = useMemo(() => {
    const todaysCheckinIds = new Set(checkins.map(c => c.member));

    const processedMembers = members.map(member => ({
      ...member,
      membership: {
        ...member.membership,
        status: new Date() < new Date(member.membership.endDate) ? 'Active' : 'Expired'
      },
      hasCheckedIn: todaysCheckinIds.has(member._id)
    }));

    const filteredByStatus = processedMembers.filter(member => {
      if (filter === 'all') return true;
      return member.membership.status.toLowerCase() === filter;
    });

    const filteredBySearch = filteredByStatus.filter(member =>
      searchTerm === '' ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBySearch.length / membersPerPage);
    const startIndex = (currentPage - 1) * membersPerPage;
    
    return {
      members: filteredBySearch.slice(startIndex, startIndex + membersPerPage),
      totalPages: totalPages,
    };
  }, [members, checkins, filter, searchTerm, currentPage]);

  const handleAddMember = async (memberData) => {
    try {
      const response = await addMember(memberData);
      setMembers([response.data, ...members]);
    } catch (err) {
      alert('Error adding member: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleRenewMember = async (memberId, planId) => {
    try {
      const response = await renewMember(memberId, planId);
      setMembers(members.map(m => m._id === memberId ? response.data : m));
      setIsRenewModalOpen(false);
    } catch (err) {
      alert('Error renewing membership: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleUpdateMember = async (memberId, memberData, setErrorCallback) => {
    try {
      const response = await updateMember(memberId, memberData);
      setMembers(members.map(m => m._id === memberId ? response.data : m));
      setIsEditModalOpen(false);
    } catch (err) {
      setErrorCallback(err.response?.data?.msg || err.message);
    }
  };

  const printInvoice = (member) => {
    const latestTransaction = { planName: member.membership.planName, price: member.membership.price };
    const invoiceHTML = `
        <div id="invoice-section" class="p-10 bg-white" style="font-family: 'Inter', sans-serif;">
            <div class="flex justify-between items-start mb-12"><div class="flex items-center"><svg class="w-12 h-12 mr-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><div><h1 class="text-2xl font-bold text-gray-800">FITNESS CLUB</h1><p class="text-sm text-gray-500">Jl. Raya Padalarang No. 451</p><p class="text-sm text-gray-500">Padalarang, Jawa Barat</p></div></div><div class="text-right"><h2 class="text-3xl font-bold text-gray-700">INVOICE</h2><p class="text-sm text-gray-500">#${member._id.slice(-6).toUpperCase()}</p></div></div>
            <div class="grid grid-cols-2 gap-4 mb-12"><div><p class="text-sm font-semibold text-gray-600 mb-1">BILLED TO</p><p class="font-medium text-gray-800">${member.name}</p><p class="text-gray-600">${member.email}</p></div><div class="text-right"><p class="text-sm font-semibold text-gray-600">Date of Issue</p><p class="font-medium text-gray-800">${new Date().toLocaleDateString('en-GB')}</p><p class="text-sm font-semibold text-gray-600 mt-2">Status</p><p class="font-medium text-green-500">Paid</p></div></div>
            <table class="w-full text-left mb-12"><thead class="bg-gray-100"><tr><th class="p-3 text-sm font-semibold text-gray-700">DESCRIPTION</th><th class="p-3 text-right text-sm font-semibold text-gray-700">AMOUNT</th></tr></thead><tbody><tr class="border-b border-gray-100"><td class="p-3">Membership: ${latestTransaction.planName}</td><td class="p-3 text-right">${formatCurrency(latestTransaction.price)}</td></tr></tbody></table>
            <div class="flex justify-end mb-12"><div class="w-full max-w-xs"><div class="flex justify-between mb-2"><p class="text-gray-600">Subtotal</p><p class="text-gray-800">${formatCurrency(latestTransaction.price)}</p></div><div class="flex justify-between mb-2"><p class="text-gray-600">Tax</p><p class="text-gray-800">${formatCurrency(0)}</p></div><div class="border-t border-gray-200 my-2"></div><div class="flex justify-between"><p class="font-bold text-gray-800">Total</p><p class="font-bold text-blue-600 text-lg">${formatCurrency(latestTransaction.price)}</p></div></div></div>
            <div class="text-center text-sm text-gray-500 border-t pt-6"><p class="font-semibold">Thank you for your business!</p><p>If you have any questions, please contact us at (022) 123-4567.</p></div>
        </div>`;
    
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = invoiceHTML;
    document.body.appendChild(tempContainer);
    
    document.body.classList.add('print-active');
    window.print();
    document.body.classList.remove('print-active');

    document.body.removeChild(tempContainer);
  };

  const handleTableAction = async (action, member) => {
    if (action === 'viewProfile') {
      onNavigate('profile', member._id);
    } else if (action === 'checkin') {
      try {
        await createCheckin(member._id);
        const newCheckin = { _id: new Date().toISOString(), memberName: member.name, checkInTime: new Date() };
        setCheckins([newCheckin, ...checkins]);
      } catch (err) {
        alert('Error checking in: ' + (err.response?.data?.msg || err.message));
      }
    } else if (action === 'renew') {
      setSelectedMember(member);
      setIsRenewModalOpen(true);
    } else if (action === 'edit') {
      setSelectedMember(member);
      setIsEditModalOpen(true);
    } else if (action === 'print') {
      printInvoice(member);
    }
  };

  if (loading) return <p>Loading members...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Member Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <RegistrationForm plans={plans} onMemberAdded={handleAddMember} />
          <AttendanceList checkins={checkins} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Current Members</h2>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600">Filter:</span>
            {['all', 'active', 'expired'].map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-full text-sm ${filter === f ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <MemberTable members={paginatedMembers.members} onAction={handleTableAction} />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {paginatedMembers.totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= paginatedMembers.totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <RenewMemberModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        onSave={handleRenewMember}
        member={selectedMember}
        plans={plans}
      />
      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateMember}
        member={selectedMember}
      />
    </div>
  );
};

export default MembersView;
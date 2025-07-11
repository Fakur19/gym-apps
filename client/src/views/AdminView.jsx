import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { getPlans, createPlan, updatePlan, deletePlan } from '../services/api';
import AddPlanForm from '../components/AddPlanForm';
import PlanList from '../components/PlanList';
import EditPlanModal from '../components/EditPlanModal';

const AdminView = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  
  // State for the edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getPlans();
      setPlans(response.data);
    } catch (err) {
      setError('Failed to fetch plans.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddPlan = async (planData) => {
    try {
      const response = await createPlan(planData);
      setPlans([...plans, response.data]);
      showToast('Membership plan added successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error adding plan.', 'error');
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleUpdatePlan = async (id, planData) => {
    try {
      const response = await updatePlan(id, planData);
      setPlans(plans.map(p => (p._id === id ? response.data : p)));
      setIsModalOpen(false);
      setSelectedPlan(null);
      showToast('Membership plan updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error updating plan.', 'error');
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan? This cannot be undone.')) {
      try {
        await deletePlan(id);
        setPlans(plans.filter(p => p._id !== id));
        showToast('Membership plan deleted successfully!', 'success');
      } catch (err) {
        showToast(err.response?.data?.msg || 'Error deleting plan.', 'error');
      }
    }
  };

  if (loading) return <p>Loading admin settings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddPlanForm onPlanAdded={handleAddPlan} />
        </div>
        <div className="lg:col-span-2">
          <PlanList plans={plans} onEdit={handleEditPlan} onDelete={handleDeletePlan} />
        </div>
      </div>
      <EditPlanModal
        isOpen={isModalOpen}
        plan={selectedPlan}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdatePlan}
      />
    </div>
  );
};

export default AdminView;
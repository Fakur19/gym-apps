import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import { getPlans, createPlan, updatePlan, deletePlan } from '../services/api';
import AddPlanForm from '../components/AddPlanForm';
import PlanList from '../components/PlanList';
import EditPlanModal from '../components/EditPlanModal';

const AdminView = () => {
  const { t } = useTranslation();
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
      setError(t('no_plans_found'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [t]);

  const handleAddPlan = async (planData) => {
    try {
      const response = await createPlan(planData);
      setPlans([...plans, response.data]);
      showToast(t('add_plan_success'), 'success');
    } catch (err) {
      showToast(err.response?.data?.msg || t('add_plan_error'), 'error');
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
      showToast(t('update_plan_success'), 'success');
    } catch (err) {
      showToast(err.response?.data?.msg || t('update_plan_error'), 'error');
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm(t('delete_plan_confirm'))) {
      try {
        await deletePlan(id);
        setPlans(plans.filter(p => p._id !== id));
        showToast(t('delete_plan_success'), 'success');
      } catch (err) {
        showToast(err.response?.data?.msg || t('delete_plan_error'), 'error');
      }
    }
  };

  if (loading) return <p>{t('loading_admin_settings')}</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('admin_panel')}</h1>
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
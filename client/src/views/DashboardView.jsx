import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getDashboardStats } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartCard from '../components/ChartCard';
import ExpiringMembersList from '../components/ExpiringMembersList';
import { FaMoneyBillWave, FaSignInAlt, FaUserCheck, FaUserPlus } from 'react-icons/fa';
import Spinner from '../components/Spinner';

const DashboardView = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Store chart data locally
  const [weeklyChartData, setWeeklyChartData] = useState(null);
  const [monthlyChartData, setMonthlyChartData] = useState(null);

  const revenueChartRef = useRef(null);
  const trafficChartRef = useRef(null);
  const busiestHoursChartRef = useRef(null);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data);
        setWeeklyChartData(response.data.charts.weeklyData);
        setMonthlyChartData(response.data.charts.monthlyData);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (stats && weeklyChartData && monthlyChartData) {
      renderRevenueChart(weeklyChartData);
      renderTrafficChart(weeklyChartData);
      renderBusiestHoursChart(stats.charts.busiestHours);
    }
  }, [stats, weeklyChartData, monthlyChartData]);

  const renderRevenueChart = (data) => {
    if (revenueChartRef.current?.chart) revenueChartRef.current.chart.destroy();
    const ctx = revenueChartRef.current.getContext('2d');
    revenueChartRef.current.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.day),
        datasets: [{ label: 'Revenue (IDR)', data: data.map(d => d.revenue), backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  };

  const renderTrafficChart = (data) => {
    if (trafficChartRef.current?.chart) trafficChartRef.current.chart.destroy();
    const ctx = trafficChartRef.current.getContext('2d');
    trafficChartRef.current.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.day),
        datasets: [{ label: 'Check-ins', data: data.map(d => d.checkins), backgroundColor: 'rgba(75, 192, 192, 0.6)' }]
      },
      options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  };

  const renderBusiestHoursChart = (data) => {
    if (busiestHoursChartRef.current?.chart) busiestHoursChartRef.current.chart.destroy();
    const ctx = busiestHoursChartRef.current.getContext('2d');
    const hoursData = Array(24).fill(0);
    data.forEach(item => { hoursData[item._id] = item.count; });
    const labels = Array.from({ length: 24 }, (_, i) => {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? 'AM' : 'PM';
      return `${hour} ${ampm}`;
    });
    busiestHoursChartRef.current.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{ label: 'Total Check-ins', data: hoursData, borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', fill: true, tension: 0.3 }]
      },
      options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  };

  const handleChartToggle = (e, chartType) => {
    const newRange = e.target.dataset.range;
    const dataToRender = newRange === 'monthly' ? monthlyChartData : weeklyChartData;

    if (chartType === 'revenue') {
      renderRevenueChart(dataToRender);
    } else if (chartType === 'traffic') {
      renderTrafficChart(dataToRender);
    }
    
    const toggleContainer = e.currentTarget;
    toggleContainer.querySelectorAll('.chart-toggle-btn').forEach(btn => btn.classList.remove('active-chart-toggle'));
    e.target.classList.add('active-chart-toggle');
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Today's Revenue" value={formatCurrency(stats.kpi.todaysRevenue)} icon={<FaMoneyBillWave className="h-6 w-6" />} />
        <KpiCard title="Today's Check-ins" value={stats.kpi.todaysCheckins} icon={<FaSignInAlt className="h-6 w-6" />} />
        <KpiCard title="Active Members" value={stats.kpi.activeMembers} icon={<FaUserCheck className="h-6 w-6" />} />
        <KpiCard title="New Members Today" value={stats.kpi.newMembersToday} icon={<FaUserPlus className="h-6 w-6" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <div className="toggle-container" onClick={(e) => handleChartToggle(e, 'revenue')}>
              <button data-range="weekly" className="chart-toggle-btn active-chart-toggle">Weekly</button>
              <button data-range="monthly" className="chart-toggle-btn">Monthly</button>
            </div>
          </div>
          <canvas ref={revenueChartRef}></canvas>
        </ChartCard>
        <ChartCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Traffic (Check-ins)</h3>
            <div className="toggle-container" onClick={(e) => handleChartToggle(e, 'traffic')}>
              <button data-range="weekly" className="chart-toggle-btn active-chart-toggle">Weekly</button>
              <button data-range="monthly" className="chart-toggle-btn">Monthly</button>
            </div>
          </div>
          <canvas ref={trafficChartRef}></canvas>
        </ChartCard>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Memberships Expiring This Week">
          <ExpiringMembersList members={stats.expiringSoon} />
        </ChartCard>
        <ChartCard title="Busiest Hours (Last 30 Days)">
          <canvas ref={busiestHoursChartRef}></canvas>
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardView;
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getDashboardStats } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartCard from '../components/ChartCard';
import ExpiringMembersList from '../components/ExpiringMembersList';
import { FaMoneyBillWave, FaSignInAlt, FaUserCheck, FaUserPlus } from 'react-icons/fa';

const DashboardView = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (stats) {
      // Destroy previous charts before rendering new ones
      if (revenueChartRef.current?.chart) revenueChartRef.current.chart.destroy();
      if (trafficChartRef.current?.chart) trafficChartRef.current.chart.destroy();
      if (busiestHoursChartRef.current?.chart) busiestHoursChartRef.current.chart.destroy();

      // Render Revenue Chart
      const revenueCtx = revenueChartRef.current.getContext('2d');
      revenueChartRef.current.chart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: stats.charts.weeklyData.map(d => d.day),
          datasets: [{ label: 'Revenue (IDR)', data: stats.charts.weeklyData.map(d => d.revenue), backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
        },
        options: { scales: { y: { beginAtZero: true } } }
      });

      // Render Traffic Chart
      const trafficCtx = trafficChartRef.current.getContext('2d');
      trafficChartRef.current.chart = new Chart(trafficCtx, {
        type: 'bar',
        data: {
          labels: stats.charts.weeklyData.map(d => d.day),
          datasets: [{ label: 'Check-ins', data: stats.charts.weeklyData.map(d => d.checkins), backgroundColor: 'rgba(75, 192, 192, 0.6)' }]
        },
        options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
      });

      // Render Busiest Hours Chart
      const busiestHoursCtx = busiestHoursChartRef.current.getContext('2d');
      const hoursData = Array(24).fill(0);
      stats.charts.busiestHours.forEach(item => { hoursData[item._id] = item.count; });
      const labels = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const ampm = i < 12 ? 'AM' : 'PM';
        return `${hour} ${ampm}`;
      });
      busiestHoursChartRef.current.chart = new Chart(busiestHoursCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{ label: 'Total Check-ins', data: hoursData, borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', fill: true, tension: 0.3 }]
        },
        options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
      });
    }
  }, [stats]);

  if (loading) return <p>Loading Dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
        <ChartCard title="Weekly Revenue"><canvas ref={revenueChartRef}></canvas></ChartCard>
        <ChartCard title="Weekly Traffic (Check-ins)"><canvas ref={trafficChartRef}></canvas></ChartCard>
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
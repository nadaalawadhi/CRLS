import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import chroma from 'chroma-js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error(error);
        setError('Error fetching stats');
      }

      try {
        const carsResponse = await axios.get('/api/cars');
        const cars = carsResponse.data;
        const uniqueCategories = [...new Set(cars.map((car) => car.category))];
        const categoryCounts = uniqueCategories.map(
          (category) => cars.filter((car) => car.category === category).length
        );
        setCategories(uniqueCategories);
        setCategoryCounts(categoryCounts);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch car categories');
      }
    };

    fetchStats();
  }, []);

  const generateColors = (num) => chroma.scale('Set3').mode('lab').colors(num);

  if (error) {
    return <div>{error}</div>;
  }

  if (!stats) {
    return <div>Loading...</div>;
  }

  // Data for the charts
  const statusData = {
    labels: ['Completed', 'Ongoing', 'Cancelled', 'Upcoming'],
    datasets: [
      {
        label: 'Reservations by Status',
        data: [
          stats.completedReservations || 0,
          stats.ongoingReservations || 0,
          stats.cancelledReservations || 0,
          stats.upcomingReservations || 0,
        ],
        backgroundColor: ['#4caf50', '#2196f3', '#f44336', '#ff9800'],
      },
    ],
  };

  const carCategoryData = {
    labels: categories,
    datasets: [
      {
        label: 'Car Categories',
        data: categoryCounts,
        backgroundColor: generateColors(categories.length),
      },
    ],
  };

  const revenueData = {
    labels: stats.revenueDates || [],
    datasets: [
      {
        label: 'Revenue Growth',
        data: stats.revenueValues || [],
        fill: false,
        borderColor: '#4caf50',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      {/* <h1>Admin Dashboard</h1> */}
      <div className="stats-overview">
        <div className="stats-box total-reservations">
          <div>Total Reservations</div>
          <div>{stats.totalReservations || 0}</div>
        </div>
        <div className="stats-box total-users">
          <div>Total Users</div>
          <div>{stats.totalUsers-1 || 0}</div>
        </div>
        <div className="stats-box total-revenue">
          <div>Total Revenue</div>
          <div>{stats.totalRevenue || 0} BHD</div>
        </div>
        <div className="stats-box total-cars">
          <div>Total Cars</div>
          <div>{stats.totalCars || 0}</div>
        </div>
      </div>

      <br/>

      <div className="charts-wrapper">
        <div className="chart-container">
          <h3>Reservations by Status</h3>
          <br/><br/><br/><br/>
          <Bar data={statusData} options={{ responsive: true }} />
        </div>

        <div className="chart-container">
          <h3>Car Categories</h3>
          <Pie data={carCategoryData} options={{ responsive: true }} />
        </div>

        <div className="chart-container">
          <h3>Revenue Growth</h3>
          <br/><br/><br/><br/>
          <Line data={revenueData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

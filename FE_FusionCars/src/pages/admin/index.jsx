import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Car,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';

/**
 * Admin Dashboard
 *
 * Comprehensive admin panel for managing the Fusion Cars platform
 * Features:
 * - Real-time statistics and analytics
 * - Car listing management (CRUD operations)
 * - User management
 * - Booking management
 * - Review moderation
 */

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      // Fetch stats
      const statsRes = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch cars
      const carsRes = await fetch('http://localhost:5000/api/cars?limit=10');
      const carsData = await carsRes.json();
      setCars(carsData.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const deleteCar = async (carId) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/admin/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh data
      fetchDashboardData();
      alert('Car deleted successfully');
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Failed to delete car');
    }
  };

  const toggleFeatured = async (carId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/admin/cars/${carId}/featured`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Fusion Cars</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-primary-black">
        {/* Header */}
        <header className="bg-primary-dark border-b border-accent-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Fusion Cars Admin</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-primary-dark border-b border-accent-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {['overview', 'cars', 'bookings', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 transition ${
                    activeTab === tab
                      ? 'border-accent-silver text-white'
                      : 'border-transparent text-accent-stone hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Car}
                  title="Total Cars"
                  value={stats?.overview?.totalCars || 0}
                  subtitle={`${stats?.overview?.availableCars || 0} available`}
                  color="blue"
                />
                <StatCard
                  icon={DollarSign}
                  title="Revenue (30d)"
                  value={`₹${((stats?.sales?.last30DaysRevenue || 0) / 100000).toFixed(1)}L`}
                  subtitle={`${stats?.sales?.recentSales?.length || 0} sales`}
                  color="green"
                />
                <StatCard
                  icon={Users}
                  title="Total Users"
                  value={stats?.overview?.totalUsers || 0}
                  subtitle="Registered customers"
                  color="purple"
                />
                <StatCard
                  icon={Calendar}
                  title="Bookings"
                  value={stats?.overview?.totalBookings || 0}
                  subtitle={`${stats?.overview?.pendingBookings || 0} pending`}
                  color="orange"
                />
              </div>

              {/* Recent Sales */}
              <div className="bg-primary-dark rounded-lg p-6 border border-accent-charcoal">
                <h2 className="text-xl font-bold text-white mb-4">Recent Sales</h2>
                <div className="space-y-3">
                  {stats?.sales?.recentSales?.slice(0, 5).map((sale) => (
                    <div
                      key={sale._id}
                      className="flex justify-between items-center p-3 bg-primary-charcoal rounded-lg"
                    >
                      <div>
                        <p className="text-white font-semibold">{sale.name}</p>
                        <p className="text-sm text-accent-stone">
                          {new Date(sale.soldDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-silver font-bold">₹{(sale.price / 100000).toFixed(2)}L</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'cars' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Car Listings</h2>
                <button
                  onClick={() => router.push('/admin/cars/create')}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-silver text-primary-black rounded-lg hover:bg-neutral-light transition"
                >
                  <Plus size={20} />
                  Add New Car
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {cars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-primary-dark rounded-lg p-6 border border-accent-charcoal"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <img
                          src={car.image || 'https://via.placeholder.com/150'}
                          alt={car.name}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white">{car.name}</h3>
                          <p className="text-accent-stone">
                            {car.year} | {car.fuelType} | {car.transmission}
                          </p>
                          <p className="text-accent-silver font-bold mt-2">
                            ₹{(car.price / 100000).toFixed(2)} Lakh
                          </p>
                          {car.featured && (
                            <span className="inline-block mt-2 px-2 py-1 bg-yellow-600 text-white text-xs rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFeatured(car._id)}
                          className="p-2 bg-primary-charcoal text-accent-silver rounded-lg hover:bg-accent-charcoal transition"
                          title="Toggle Featured"
                        >
                          <Star size={20} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/cars/edit/${car._id}`)}
                          className="p-2 bg-primary-charcoal text-accent-silver rounded-lg hover:bg-accent-charcoal transition"
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => deleteCar(car._id)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'bookings' && (
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Bookings Management</h2>
              <p className="text-accent-stone">Booking management interface coming soon...</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Review Moderation</h2>
              <p className="text-accent-stone">Review moderation interface coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, title, value, subtitle, color }) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    purple: 'from-purple-600 to-purple-800',
    orange: 'from-orange-600 to-orange-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-6 text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} />
        <BarChart3 size={24} className="opacity-50" />
      </div>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-sm opacity-75 mt-2">{subtitle}</p>
    </motion.div>
  );
}

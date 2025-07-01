import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dealService } from '@/services/api/dealService';
import { taskService } from '@/services/api/taskService';
import { activityService } from '@/services/api/activityService';
import { format, isToday, isTomorrow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import DashboardStats from '@/components/organisms/DashboardStats';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';

const Dashboard = () => {
  const [recentDeals, setRecentDeals] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [deals, tasks, activities] = await Promise.all([
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ]);

      // Get recent deals (last 5)
      const sortedDeals = deals
        .filter(d => d.stage !== 'Closed Lost')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentDeals(sortedDeals);

      // Get upcoming tasks (next 5)
      const pendingTasks = tasks
        .filter(t => t.status !== 'Completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
      setUpcomingTasks(pendingTasks);

      // Get recent activities (last 5)
      const recentActs = activities.slice(0, 5);
      setRecentActivities(recentActs);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTaskDateBadge = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) {
      return { text: 'Today', variant: 'warning' };
    }
    if (isTomorrow(date)) {
      return { text: 'Tomorrow', variant: 'info' };
    }
    return null;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return 'Phone';
      case 'Email': return 'Mail';
      case 'Meeting': return 'Calendar';
      case 'Note': return 'FileText';
      default: return 'Activity';
    }
  };

  if (loading) return <Loading type="dashboard" />;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-premium"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100 text-lg">
              Here's what's happening with your sales pipeline today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Deals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 shadow-card"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Deals</h3>
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentDeals.map((deal) => (
              <div key={deal.Id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {deal.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {deal.stage} • {deal.probability}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold gradient-text">
                    {formatCurrency(deal.value)}
                  </p>
                </div>
              </div>
            ))}
            {recentDeals.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent deals
              </p>
            )}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 shadow-card"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {upcomingTasks.map((task) => {
              const dateBadge = getTaskDateBadge(task.dueDate);
              return (
                <div key={task.Id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 flex-1 truncate">
                      {task.title}
                    </p>
                    {dateBadge && (
                      <Badge variant={dateBadge.variant} size="sm">
                        {dateBadge.text}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                  </div>
                </div>
              );
            })}
            {upcomingTasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No upcoming tasks
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 shadow-card"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <ApperIcon name="Activity" className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.Id} className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ApperIcon name={getActivityIcon(activity.type)} className="w-3 h-3 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activities
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
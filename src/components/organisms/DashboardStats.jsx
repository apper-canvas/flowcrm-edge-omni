import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import { taskService } from '@/services/api/taskService';
import { activityService } from '@/services/api/activityService';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalDealValue: 0,
    pendingTasks: 0,
    recentActivities: 0,
    winRate: 0,
    avgDealSize: 0,
    pipelineValue: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [contacts, deals, tasks, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ]);

      const totalContacts = contacts.length;
      const totalDeals = deals.length;
      const wonDeals = deals.filter(d => d.stage === 'Closed Won');
      const activePipeline = deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
      const totalDealValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
      const pipelineValue = activePipeline.reduce((sum, deal) => sum + deal.value, 0);
      const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
      const recentActivities = activities.filter(a => {
        const activityDate = new Date(a.timestamp);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return activityDate >= weekAgo;
      }).length;
      
      const winRate = totalDeals > 0 ? Math.round((wonDeals.length / totalDeals) * 100) : 0;
      const avgDealSize = wonDeals.length > 0 ? Math.round(totalDealValue / wonDeals.length) : 0;

      setStats({
        totalContacts,
        totalDeals,
        totalDealValue,
        pendingTasks,
        recentActivities,
        winRate,
        avgDealSize,
        pipelineValue
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: 'Users',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(stats.pipelineValue),
      icon: 'TrendingUp',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Won Deals',
      value: formatCurrency(stats.totalDealValue),
      icon: 'Target',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      change: '+23%',
      trend: 'up'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: 'CheckSquare',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      change: '-5%',
      trend: 'down'
    },
    {
      title: 'Win Rate',
      value: `${stats.winRate}%`,
      icon: 'Award',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      change: '+3%',
      trend: 'up'
    },
    {
      title: 'Avg Deal Size',
      value: formatCurrency(stats.avgDealSize),
      icon: 'DollarSign',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'from-accent-50 to-accent-100',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Recent Activities',
      value: stats.recentActivities,
      icon: 'Activity',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      change: '+7%',
      trend: 'up'
    },
    {
      title: 'Total Deals',
      value: stats.totalDeals,
      icon: 'Briefcase',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100',
      change: '+18%',
      trend: 'up'
    }
  ];

  if (loading) return <Loading type="dashboard" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-card p-6 hover:shadow-lg transition-all duration-200 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
              <ApperIcon name={stat.icon} className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <div className={`flex items-center text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <ApperIcon 
                name={stat.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className="w-4 h-4 mr-1" 
              />
              {stat.change}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
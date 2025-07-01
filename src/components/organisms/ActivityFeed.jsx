import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { activityService } from '@/services/api/activityService';
import { contactService } from '@/services/api/contactService';
import { dealService } from '@/services/api/dealService';
import { format, formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const ActivityFeed = ({ onAddActivity }) => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  };

  const getDealTitle = (dealId) => {
    if (!dealId) return null;
    const deal = deals.find(d => d.Id === dealId);
    return deal ? deal.title : 'Unknown Deal';
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

  const getActivityColor = (type) => {
    switch (type) {
      case 'Call': return 'text-blue-600 bg-blue-100';
      case 'Email': return 'text-green-600 bg-green-100';
      case 'Meeting': return 'text-purple-600 bg-purple-100';
      case 'Note': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const handleDeleteActivity = async (activityId) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await activityService.delete(activityId);
      setActivities(activities.filter(a => a.Id !== activityId));
      toast.success('Activity deleted successfully');
    } catch (err) {
      toast.error('Failed to delete activity');
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Activities', count: activities.length },
            { key: 'Call', label: 'Calls', count: activities.filter(a => a.type === 'Call').length },
            { key: 'Email', label: 'Emails', count: activities.filter(a => a.type === 'Email').length },
            { key: 'Meeting', label: 'Meetings', count: activities.filter(a => a.type === 'Meeting').length },
            { key: 'Note', label: 'Notes', count: activities.filter(a => a.type === 'Note').length }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === item.key
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>
        <Button onClick={onAddActivity} icon="Plus">
          Log Activity
        </Button>
      </div>

      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          description={filter === 'all' 
            ? "Start tracking your interactions by logging your first activity." 
            : `No ${filter.toLowerCase()} activities found.`
          }
          actionLabel="Log Activity"
          onAction={onAddActivity}
          icon="Activity"
          showAction={filter === 'all'}
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 shadow-card p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <ApperIcon name={getActivityIcon(activity.type)} className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="primary" size="sm">
                        {activity.type}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {getContactName(activity.contactId)}
                      </span>
                      {activity.dealId && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {getDealTitle(activity.dealId)}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                      <button
                        onClick={() => handleDeleteActivity(activity.Id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                        {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                      </div>
                      {activity.duration > 0 && (
                        <div className="flex items-center">
                          <ApperIcon name="Timer" className="w-4 h-4 mr-1" />
                          {activity.duration} minutes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
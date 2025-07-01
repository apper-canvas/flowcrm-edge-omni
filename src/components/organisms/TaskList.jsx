import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import { contactService } from '@/services/api/contactService';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const TaskList = ({ onAddTask, onTaskSelect }) => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : 'No Contact';
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const getDateBadge = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return { text: 'Overdue', variant: 'danger' };
    }
    if (isToday(date)) {
      return { text: 'Today', variant: 'warning' };
    }
    if (isTomorrow(date)) {
      return { text: 'Tomorrow', variant: 'info' };
    }
    return null;
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await taskService.update(taskId, { status: newStatus });
      setTasks(tasks.map(task =>
        task.Id === taskId ? { ...task, status: newStatus } : task
      ));
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending': return task.status === 'Pending';
      case 'completed': return task.status === 'Completed';
      case 'high-priority': return task.priority === 'High';
      case 'today': return isToday(new Date(task.dueDate));
      default: return true;
    }
  });

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Tasks', count: tasks.length },
            { key: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'Pending').length },
            { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'Completed').length },
            { key: 'high-priority', label: 'High Priority', count: tasks.filter(t => t.priority === 'High').length },
            { key: 'today', label: 'Due Today', count: tasks.filter(t => isToday(new Date(t.dueDate))).length }
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
        <Button onClick={onAddTask} icon="Plus">
          Add Task
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description={filter === 'all' 
            ? "Stay organized by adding your first task." 
            : "No tasks match the current filter."
          }
          actionLabel="Add Task"
          onAction={onAddTask}
          icon="CheckSquare"
          showAction={filter === 'all'}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task, index) => {
              const dateBadge = getDateBadge(task.dueDate);
              
              return (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => handleToggleStatus(task.Id, task.status)}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.status === 'Completed'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500'
                          : 'border-gray-300 hover:border-primary-500'
                      }`}
                    >
                      {task.status === 'Completed' && (
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3
                          className={`text-sm font-medium cursor-pointer hover:text-primary-600 ${
                            task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                          onClick={() => onTaskSelect(task)}
                        >
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant={getPriorityVariant(task.priority)} size="sm">
                            {task.priority}
                          </Badge>
                          <Badge variant={getStatusVariant(task.status)} size="sm">
                            {task.status}
                          </Badge>
                          {dateBadge && (
                            <Badge variant={dateBadge.variant} size="sm">
                              {dateBadge.text}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                          {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="User" className="w-4 h-4 mr-1" />
                          {getContactName(task.contactId)}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="UserCheck" className="w-4 h-4 mr-1" />
                          {task.assignedTo}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onTaskSelect(task)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      >
                        <ApperIcon name="Eye" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.Id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
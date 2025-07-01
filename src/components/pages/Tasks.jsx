import { useState } from 'react';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import TaskForm from '@/components/organisms/TaskForm';
import Modal from '@/components/molecules/Modal';

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleSaveTask = () => {
    setShowForm(false);
    setSelectedTask(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">
            Stay organized and track your to-do items
          </p>
        </div>
      </div>

      <TaskList
        key={refreshKey}
        onTaskSelect={handleEditTask}
        onAddTask={handleAddTask}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedTask ? 'Edit Task' : 'Add New Task'}
        size="lg"
      >
        <TaskForm
          task={selectedTask}
          onSave={handleSaveTask}
          onCancel={handleCloseForm}
        />
      </Modal>
    </motion.div>
  );
};

export default Tasks;
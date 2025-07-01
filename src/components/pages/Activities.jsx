import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivityFeed from '@/components/organisms/ActivityFeed';
import ActivityForm from '@/components/organisms/ActivityForm';
import Modal from '@/components/molecules/Modal';

const Activities = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setShowForm(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setShowForm(true);
  };

  const handleSaveActivity = () => {
    setShowForm(false);
    setSelectedActivity(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedActivity(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-2">
            Track all your customer interactions and communications
          </p>
        </div>
      </div>

      <ActivityFeed
        key={refreshKey}
        onAddActivity={handleAddActivity}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedActivity ? 'Edit Activity' : 'Log New Activity'}
        size="lg"
      >
        <ActivityForm
          activity={selectedActivity}
          onSave={handleSaveActivity}
          onCancel={handleCloseForm}
        />
      </Modal>
    </motion.div>
  );
};

export default Activities;
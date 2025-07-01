import { useState } from 'react';
import { motion } from 'framer-motion';
import DealPipeline from '@/components/organisms/DealPipeline';
import DealForm from '@/components/organisms/DealForm';
import Modal from '@/components/molecules/Modal';

const Deals = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowForm(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowForm(true);
  };

  const handleSaveDeal = () => {
    setShowForm(false);
    setSelectedDeal(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDeal(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your deals through the sales process
          </p>
        </div>
      </div>

      <DealPipeline
        key={refreshKey}
        onDealSelect={handleEditDeal}
        onAddDeal={handleAddDeal}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedDeal ? 'Edit Deal' : 'Add New Deal'}
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          onSave={handleSaveDeal}
          onCancel={handleCloseForm}
        />
      </Modal>
    </motion.div>
  );
};

export default Deals;
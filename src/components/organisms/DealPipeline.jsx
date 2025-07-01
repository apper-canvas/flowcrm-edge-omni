import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const DealPipeline = ({ onAddDeal, onDealSelect }) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stages = [
    { name: 'Lead', color: 'bg-gray-100 text-gray-800' },
    { name: 'Discovery', color: 'bg-blue-100 text-blue-800' },
    { name: 'Qualified', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Proposal', color: 'bg-purple-100 text-purple-800' },
    { name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
    { name: 'Closed Won', color: 'bg-green-100 text-green-800' },
    { name: 'Closed Lost', color: 'bg-red-100 text-red-800' }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load pipeline data');
      toast.error('Failed to load pipeline data');
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

  const getDealsForStage = (stageName) => {
    return deals.filter(deal => deal.stage === stageName);
  };

  const handleDragStart = (e, deal) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(deal));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    try {
      const dealData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (dealData.stage === newStage) return;

      await dealService.updateStage(dealData.Id, newStage);
      
      const updatedDeals = deals.map(deal =>
        deal.Id === dealData.Id ? { ...deal, stage: newStage } : deal
      );
      setDeals(updatedDeals);
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error('Failed to update deal stage');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Pipeline</h2>
          <p className="text-gray-600">Track deals through your sales process</p>
        </div>
        <Button onClick={onAddDeal} icon="Plus">
          Add Deal
        </Button>
      </div>

      {deals.length === 0 ? (
        <Empty
          title="No deals in pipeline"
          description="Start tracking your sales opportunities by adding your first deal."
          actionLabel="Add Deal"
          onAction={onAddDeal}
          icon="TrendingUp"
        />
      ) : (
        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-4" style={{ minWidth: '1400px' }}>
            {stages.map((stage) => {
              const stageDeals = getDealsForStage(stage.name);
              const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
              
              return (
                <div
                  key={stage.name}
                  className="flex-shrink-0 w-80"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.name)}
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-card h-full">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                        <Badge variant="default" size="sm">
                          {stageDeals.length}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        {formatCurrency(stageValue)}
                      </p>
                    </div>
                    
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {stageDeals.map((deal, index) => (
                        <motion.div
                          key={deal.Id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal)}
                          onClick={() => onDealSelect(deal)}
                          className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-200 card-hover"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                {deal.title}
                              </h4>
                              <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold gradient-text">
                                {formatCurrency(deal.value)}
                              </span>
                              <Badge variant="info" size="sm">
                                {deal.probability}%
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <ApperIcon name="User" className="w-4 h-4 mr-1" />
                              {getContactName(deal.contactId)}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                              Expected: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealPipeline;
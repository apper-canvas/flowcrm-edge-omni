import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const DealForm = ({ deal = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    value: deal?.value || '',
    stage: deal?.stage || 'Lead',
    probability: deal?.probability || '',
    contactId: deal?.contactId || '',
    expectedCloseDate: deal?.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : ''
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const stages = [
    { value: 'Lead', label: 'Lead' },
    { value: 'Discovery', label: 'Discovery' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ];

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactsData = await contactService.getAll();
        setContacts(contactsData);
      } catch (error) {
        toast.error('Failed to load contacts');
      }
    };
    loadContacts();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required';
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Please select a contact';
    }
    
    if (!formData.probability || parseFloat(formData.probability) < 0 || parseFloat(formData.probability) > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }
    
    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = 'Expected close date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseFloat(formData.probability),
        contactId: parseInt(formData.contactId),
        expectedCloseDate: new Date(formData.expectedCloseDate).toISOString()
      };
      
      if (deal) {
        await dealService.update(deal.Id, dealData);
        toast.success('Deal updated successfully');
      } else {
        await dealService.create(dealData);
        toast.success('Deal created successfully');
      }
      
      onSave();
    } catch (error) {
      toast.error(deal ? 'Failed to update deal' : 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const contactOptions = contacts.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.name} - ${contact.company}`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Deal Title"
          type="input"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          placeholder="Enter deal title"
          required
        />
        
        <FormField
          label="Deal Value"
          type="input"
          inputType="number"
          value={formData.value}
          onChange={(e) => handleChange('value', e.target.value)}
          error={errors.value}
          placeholder="0"
          min="0"
          step="0.01"
          required
        />
        
        <FormField
          label="Stage"
          type="select"
          value={formData.stage}
          onChange={(e) => handleChange('stage', e.target.value)}
          error={errors.stage}
          options={stages}
          required
        />
        
        <FormField
          label="Probability (%)"
          type="input"
          inputType="number"
          value={formData.probability}
          onChange={(e) => handleChange('probability', e.target.value)}
          error={errors.probability}
          placeholder="0-100"
          min="0"
          max="100"
          required
        />
        
        <FormField
          label="Contact"
          type="select"
          value={formData.contactId}
          onChange={(e) => handleChange('contactId', e.target.value)}
          error={errors.contactId}
          options={contactOptions}
          placeholder="Select a contact"
          required
        />
        
        <FormField
          label="Expected Close Date"
          type="input"
          inputType="date"
          value={formData.expectedCloseDate}
          onChange={(e) => handleChange('expectedCloseDate', e.target.value)}
          error={errors.expectedCloseDate}
          required
        />
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          icon="Save"
        >
          {deal ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;
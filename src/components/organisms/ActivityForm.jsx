import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { activityService } from '@/services/api/activityService';
import { contactService } from '@/services/api/contactService';
import { dealService } from '@/services/api/dealService';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const ActivityForm = ({ activity = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: activity?.type || 'Call',
    description: activity?.description || '',
    contactId: activity?.contactId || '',
    dealId: activity?.dealId || '',
    duration: activity?.duration || ''
  });
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const activityTypes = [
    { value: 'Call', label: 'Phone Call' },
    { value: 'Email', label: 'Email' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Note', label: 'Note' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactsData, dealsData] = await Promise.all([
          contactService.getAll(),
          dealService.getAll()
        ]);
        setContacts(contactsData);
        setDeals(dealsData);
      } catch (error) {
        toast.error('Failed to load form data');
      }
    };
    loadData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Please select a contact';
    }
    
    if (formData.duration && (parseFloat(formData.duration) < 0 || parseFloat(formData.duration) > 1440)) {
      newErrors.duration = 'Duration must be between 0 and 1440 minutes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const activityData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        duration: formData.duration ? parseFloat(formData.duration) : 0
      };
      
      if (activity) {
        await activityService.update(activity.Id, activityData);
        toast.success('Activity updated successfully');
      } else {
        await activityService.create(activityData);
        toast.success('Activity logged successfully');
      }
      
      onSave();
    } catch (error) {
      toast.error(activity ? 'Failed to update activity' : 'Failed to log activity');
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

  const dealOptions = deals.map(deal => ({
    value: deal.Id.toString(),
    label: deal.title
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Activity Type"
          type="select"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          error={errors.type}
          options={activityTypes}
          required
        />
        
        <FormField
          label="Duration (minutes)"
          type="input"
          inputType="number"
          value={formData.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          error={errors.duration}
          placeholder="Leave empty for instant activities"
          min="0"
          max="1440"
        />
      </div>
      
      <FormField
        label="Related Contact"
        type="select"
        value={formData.contactId}
        onChange={(e) => handleChange('contactId', e.target.value)}
        error={errors.contactId}
        options={contactOptions}
        placeholder="Select a contact"
        required
      />
      
      <FormField
        label="Related Deal (Optional)"
        type="select"
        value={formData.dealId}
        onChange={(e) => handleChange('dealId', e.target.value)}
        error={errors.dealId}
        options={dealOptions}
        placeholder="Select a deal (optional)"
      />
      
      <FormField
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        placeholder="Describe what happened during this activity..."
        rows={4}
        required
      />
      
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
          {activity ? 'Update Activity' : 'Log Activity'}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
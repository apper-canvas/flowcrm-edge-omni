import { useState } from 'react';
import { toast } from 'react-toastify';
import { contactService } from '@/services/api/contactService';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const ContactForm = ({ contact = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    position: contact?.position || '',
    tags: contact?.tags?.join(', ') || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const contactData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };
      
      if (contact) {
        await contactService.update(contact.Id, contactData);
        toast.success('Contact updated successfully');
      } else {
        await contactService.create(contactData);
        toast.success('Contact created successfully');
      }
      
      onSave();
    } catch (error) {
      toast.error(contact ? 'Failed to update contact' : 'Failed to create contact');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          type="input"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Enter full name"
          required
        />
        
        <FormField
          label="Email Address"
          type="input"
          inputType="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          placeholder="Enter email address"
          required
        />
        
        <FormField
          label="Phone Number"
          type="input"
          inputType="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="(555) 123-4567"
        />
        
        <FormField
          label="Company"
          type="input"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          error={errors.company}
          placeholder="Company name"
          required
        />
        
        <FormField
          label="Position"
          type="input"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          error={errors.position}
          placeholder="Job title or position"
        />
        
        <FormField
          label="Tags"
          type="input"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          error={errors.tags}
          placeholder="Enterprise, CEO, Hot Lead (comma separated)"
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
          {contact ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
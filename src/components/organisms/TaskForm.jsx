import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import { contactService } from '@/services/api/contactService';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const TaskForm = ({ task = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
    priority: task?.priority || 'Medium',
    status: task?.status || 'Pending',
    contactId: task?.contactId || '',
    assignedTo: task?.assignedTo || 'Sales Rep'
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const priorities = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const statuses = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
  ];

  const assignees = [
    { value: 'Sales Rep', label: 'Sales Rep' },
    { value: 'Account Manager', label: 'Account Manager' },
    { value: 'Sales Engineer', label: 'Sales Engineer' },
    { value: 'Technical Lead', label: 'Technical Lead' },
    { value: 'Customer Success', label: 'Customer Success' },
    { value: 'Legal Team', label: 'Legal Team' }
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
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Please select a contact';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const taskData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        dueDate: new Date(formData.dueDate).toISOString()
      };
      
      if (task) {
        await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskService.create(taskData);
        toast.success('Task created successfully');
      }
      
      onSave();
    } catch (error) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
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
      <FormField
        label="Task Title"
        type="input"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        placeholder="Enter task title"
        required
      />
      
      <FormField
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        placeholder="Describe the task details..."
        rows={3}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Due Date & Time"
          type="input"
          inputType="datetime-local"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          error={errors.dueDate}
          required
        />
        
        <FormField
          label="Priority"
          type="select"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          error={errors.priority}
          options={priorities}
          required
        />
        
        <FormField
          label="Status"
          type="select"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          error={errors.status}
          options={statuses}
          required
        />
        
        <FormField
          label="Assigned To"
          type="select"
          value={formData.assignedTo}
          onChange={(e) => handleChange('assignedTo', e.target.value)}
          error={errors.assignedTo}
          options={assignees}
          required
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
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
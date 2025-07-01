import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { contactService } from '@/services/api/contactService';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const ContactList = ({ onContactSelect, onAddContact }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase()) ||
        contact.company.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await contactService.delete(contactId);
      const updatedContacts = contacts.filter(c => c.Id !== contactId);
      setContacts(updatedContacts);
      setFilteredContacts(updatedContacts.filter(contact =>
        !searchQuery || 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search contacts..."
          className="flex-1 max-w-md"
        />
        <Button onClick={onAddContact} icon="Plus">
          Add Contact
        </Button>
      </div>

      {filteredContacts.length === 0 ? (
        searchQuery ? (
          <Empty
            title="No contacts found"
            description={`No contacts match "${searchQuery}". Try adjusting your search.`}
            icon="Search"
            showAction={false}
          />
        ) : (
          <Empty
            title="No contacts yet"
            description="Start building your customer relationships by adding your first contact."
            actionLabel="Add Contact"
            onAction={onAddContact}
            icon="Users"
          />
        )
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => onContactSelect(contact)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {contact.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{contact.company}</div>
                      <div className="text-sm text-gray-500">{contact.position}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(contact.lastContactDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="primary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="default" size="sm">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onContactSelect(contact);
                          }}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContact(contact.Id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
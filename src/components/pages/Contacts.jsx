import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactList from '@/components/organisms/ContactList';
import ContactForm from '@/components/organisms/ContactForm';
import Modal from '@/components/molecules/Modal';

const Contacts = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };

  const handleSaveContact = () => {
    setShowForm(false);
    setSelectedContact(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedContact(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-2">
            Manage your customer relationships and contact information
          </p>
        </div>
      </div>

      <ContactList
        key={refreshKey}
        onContactSelect={handleEditContact}
        onAddContact={handleAddContact}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedContact ? 'Edit Contact' : 'Add New Contact'}
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSave={handleSaveContact}
          onCancel={handleCloseForm}
        />
      </Modal>
    </motion.div>
  );
};

export default Contacts;
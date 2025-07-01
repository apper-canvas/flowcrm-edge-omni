import contactsData from '@/services/mockData/contacts.json';

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      Id: Math.max(...contacts.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
      tags: contactData.tags || []
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts[index] = { ...contacts[index], ...contactData };
    return { ...contacts[index] };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts.splice(index, 1);
    return true;
  },

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company.toLowerCase().includes(lowercaseQuery)
    );
  }
};
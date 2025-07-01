import activitiesData from '@/services/mockData/activities.json';

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id), 0) + 1,
      timestamp: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    activities[index] = { ...activities[index], ...activityData };
    return { ...activities[index] };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    activities.splice(index, 1);
    return true;
  },

  async getByContact(contactId) {
    await delay(200);
    return activities
      .filter(activity => activity.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getByDeal(dealId) {
    await delay(200);
    return activities
      .filter(activity => activity.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getByType(type) {
    await delay(200);
    return activities
      .filter(activity => activity.type === type)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};
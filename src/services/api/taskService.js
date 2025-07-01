import tasksData from '@/services/mockData/tasks.json';

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      status: taskData.status || 'Pending'
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks[index] = { ...tasks[index], ...taskData };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(index, 1);
    return true;
  },

  async getByStatus(status) {
    await delay(200);
    return tasks.filter(task => task.status === status);
  },

  async getByPriority(priority) {
    await delay(200);
    return tasks.filter(task => task.priority === priority);
  }
};
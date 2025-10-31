import mockData from '@/services/mockData/tasks.json';

let tasks = [...mockData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks].sort((a, b) => b.Id - a.Id);
  },

  async getById(id) {
    await delay(300);
    const task = tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      ...taskData,
      Id: tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) + 1 : 1,
      completed: taskData.status === 'Completed',
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks[index] = {
      ...tasks[index],
      ...taskData,
      Id: id,
      completed: taskData.status === 'Completed'
    };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(index, 1);
    return { success: true };
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      (task.contactName && task.contactName.toLowerCase().includes(searchTerm)) ||
      (task.company && task.company.toLowerCase().includes(searchTerm))
    );
  }
};

export default taskService;
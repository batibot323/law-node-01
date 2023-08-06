// services/task-service.js

class TaskService {
    getTasks() {
      // Simulating fetching tasks from a database
      return [
        { id: 1, name: 'Eat' },
        { id: 2, name: 'Pray' },
      ];
    }
  }
  
  module.exports = new TaskService();
  
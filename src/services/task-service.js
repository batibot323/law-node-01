// services/task-service.js
const db = require('../db/index.js');

class TaskService {
    async getTasksFromUser(userId) {
      const text = `
        SELECT t.*
        FROM tasks t
        JOIN boards b ON t.board_id = b.id
        JOIN users u ON b.user_id = u.id
        WHERE u.id = $1;
      `;
      const values = [userId];
      let res = await db.query(text, values);
      return res.rows;
    }

    async createTask(userId, name, description) {
      const text = `
        INSERT INTO tasks (board_id, name, description)
        VALUES ((SELECT id FROM boards WHERE user_id = $1), $2, $3)
        RETURNING *;
      `;
      const values = [userId, name, description];
      let res = await db.query(text, values);
      return res.rows;
    }

    async updateTask(userId, task) {
      const text = `
        UPDATE tasks
        SET name = $1, description = $2
        WHERE id = $4 AND board_id = (SELECT id FROM boards WHERE user_id = $3) RETURNING *
      `;
      const values = [task.name, task.description, userId, task.id];
      const res = await db.query(text, values);
      return res.rows;
    }

    async deleteTask(userId, taskId) {
      const text = `
        DELETE FROM tasks
        WHERE id = $1 AND board_id = (SELECT id FROM boards WHERE user_id = $2) RETURNING *
      `;
      const values = [taskId, userId];
      const res = await db.query(text, values);
      return res.rows;
    }
  }
  
module.exports = new TaskService();
  
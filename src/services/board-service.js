const db = require ('../db/index.js');

class BoardService {
    async createBoard(userId) {
        const text = `INSERT INTO boards(user_id, tasks) VALUES($1, '{}') RETURNING *`;
        const values = [userId];
        let res;

        try {
            res = await db.query(text, values)
        } catch (err) { }
        return res;
    }

    async getBoard(userId) {
        const text = 'SELECT b.* FROM boards b WHERE b.user_id = $1;';
        const values = [userId];
        let res = await db.query(text, values);
        return res.rows[0];
    }

    async appendTask(userId, task) {
        const taskJson = JSON.stringify(task);
        const text = `
          UPDATE boards
          SET tasks = tasks || $1
          WHERE user_id = $2
          RETURNING *;
        `;
        const values = [taskJson, userId];
        const res = await db.query(text, values);
        return res.rows[0];
    }

    // With TS, we can reduce our parameter numbers by using an object.
    async reorderTasks(id, tasks, taskId, position) {
        const taskIndex = tasks.findIndex(task => task.id == taskId);
        if (taskIndex === -1) { 
            return { error: `can't find task`, error_code: `XXX` };
        }
        if (taskIndex === position) {
          return tasks;
        }
        
        // splice returns an array of the single, removed element.
        const task = tasks.splice(taskIndex, 1)[0];
        tasks.splice(position, 0, task);

        const text = 'UPDATE boards SET tasks = $1 WHERE id = $2 RETURNING *';
        const values = [JSON.stringify(tasks), id];
        await db.query(text, values);
        return tasks;
    }

    async deleteTask(userId, taskId) {
        const { tasks } = await this.getBoard(userId);
        const taskIndex = tasks.findIndex(task => task.id == taskId);
        tasks.splice(taskIndex, 1);

        const text = 'UPDATE boards SET tasks = $1 WHERE user_id = $2';
        const values = [JSON.stringify(tasks), userId];
        await db.query(text, values);
    }
}

module.exports = new BoardService();
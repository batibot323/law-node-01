const db = require ('../db/index.js');

class BoardService {
    async createBoard(userId) {
        const text = 'INSERT INTO boards(user_id) VALUES($1) RETURNING *';
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

    // With TS, we can reduce our parameter numbers by using an object.
    async reorderTasks(id, tasks, taskId, position) {
        const taskIndex = tasks.indexOf(taskId);

        // If the task is already at the desired position, return the original task order
        if (taskIndex === position) {
          return tasks;
        }
      
        // Remove the task from its current position in the array
        tasks.splice(taskIndex);
      
        // Insert the task at its new position in the array
        tasks.splice(position, 0, taskId);
      
        // Update db table `board` with the new `tasks` array.
        const text = 'UPDATE boards SET tasks = $1 WHERE id = $2 RETURNING *';
        const values = [tasks, id];
        await db.query(text, values);
      
        // Return the updated task order
        return tasks;
    }
}

module.exports = new BoardService();
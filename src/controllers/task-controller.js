const express = require('express');
const taskService = require('../services/task-service');
const boardService = require('../services/board-service');
const checkAuthHeader = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/', checkAuthHeader, (req, res) => {
  const userId = req.user_id
  taskService.getTasksFromUser(userId).then((tasks) => {res.json(tasks)});
});

// TODO: Add single get, used when clicking on a task to show more details.

router.put('/:id', checkAuthHeader, async(req, res) => {
  const userId = req.user_id
  const task = req.body;
  if (req.params.id != task.id) {
    return res.status(401).json({ error: `id in url does not match id in request body.`, error_code: `XXX` });
  }

  // For now, accept a whole task object and replace virtually everything.
  const resp = await taskService.updateTask(userId, task);
  if (resp.length == 0) {
    return res.status(404).json({ error: `can't find task`, error_code: `XXX` });
  }
  res.json(resp);
});

router.delete('/:id', checkAuthHeader, async(req, res) => {
  const userId = req.user_id
  const id = req.params.id;
  const resp = await taskService.deleteTask(userId, id);
  await boardService.deleteTask(userId, id);
  if (resp.length == 0) {
    return res.status(404).json({ error: `can't find task`, error_code: `XXX` });
  }
  res.json(resp);
});

router.post('/', checkAuthHeader, async(req, res) => {
  const userId = req.user_id
  const task = await taskService.createTask(userId, req.body.name, req.body.description);
  await boardService.appendTask(userId, task);
  res.json(task);
});
  
// Note: board_id in request.body is ignored.
router.post('/move',checkAuthHeader, async(req, res) => {
  const userId = req.user_id
  const board = await boardService.getBoard(userId);
  let updatedTasks;
  try {
    updatedTasks = await boardService.reorderTasks(board.id, board.tasks, req.body.id, req.body.position);
  } catch (err) {
      console.log(err); 
  }
  // This has weird name because supposedly it's an error and not just `updatedTasks`.
  if (updatedTasks.error) { return res.status(404).json(updatedTasks);}
  res.json(updatedTasks);
});

module.exports = router;
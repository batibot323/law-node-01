const express = require('express');
const taskService = require('../services/task-service');
const boardService = require('../services/board-service');

const router = express.Router();
let defaultUserId = 9;

router.get('/', (req, res) => {
  // Get userId from accessToken.
  const userId = req.header.user_id || defaultUserId;
  taskService.getTasksFromUser(userId).then((tasks) => {res.json(tasks)});
});

// TODO: Add single get, used when clicking on a task to show more details.

router.put('/:id', async(req, res) => {
  // Get userId from accessToken.
  // For now, accet a whole task object and replace virtually everything.
  const task = req.body;
  if (req.params.id != task.id) {
    res.statusMessage = "id in url does not match id in request body.";
    return res.status(400).end();
  }

  const userId = req.header.user_id || defaultUserId;
  const resp = await taskService.updateTask(userId, task);
  if (resp.length == 0) {
    res.statusMessage = "can't find task";
    return res.status(400).end();
  }
  res.json(resp);
});

router.delete('/:id', async(req, res) => {
  // Get userId from accessToken.
  const userId = req.header.user_id || defaultUserId;
  const resp = await taskService.deleteTask(userId, req.params.id);
  if (resp.length == 0) {
    res.statusMessage = "can't find task";
    return res.status(400).end();
  }
  res.json(resp);
});

router.post('/', async(req, res) => {
  // Get userId from accessToken.
  const userId = req.header.user_id || defaultUserId;
  const task = await taskService.createTask(userId, req.body.name, req.body.description);
  // TODO: Update db table `board` by appending this newly-created task at the last position.
  res.json(task);
});

router.post('/move', async(req, res) => {
  // Get userId from accessToken.
  const userId = req.header.user_id || defaultUserId;
  const board = await boardService.getBoard(userId);
  let updatedTasks;
  try {
    updatedTasks = await boardService.reorderTasks(board.id, board.tasks, req.body.id, req.body.position);
  } catch (err) {
      console.log(err); 
  }
  // TODO: Update db table `board` with the new `tasks` array.
  // taskService.getTasksFromUser(userId).then((tasks) => {res.json(tasks)});
  res.json(tasks);
});

module.exports = router;
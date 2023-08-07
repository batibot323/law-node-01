const express = require('express')
const taskController = require('./controllers/task-controller');
const userController = require('./controllers/user-controller');
const boardController = require('./controllers/board-controller');
const app = express()
const port = 3000

app.use(express.json()) 

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/tasks', taskController);
app.use('/users', userController);
app.use('/boards', boardController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
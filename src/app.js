const express = require('express')
// const OpenApiValidator = require('express-openapi-validator');

const taskController = require('./controllers/task-controller');
const userController = require('./controllers/user-controller');
const boardController = require('./controllers/board-controller');
const authController = require('./controllers/auth-controller');

const app = express()
const port = 3000

app.use(express.json());
// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: './src/openapi.yaml',
//     validateRequests: true, // (default)
//     validateResponses: true, // false by default
//   }),
// );

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/tasks', taskController);
app.use('/users', userController);
app.use('/boards', boardController);
app.use('/auth', authController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
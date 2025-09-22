const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { authMiddleware } = require('./middlewares/authMiddleware');
const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController'); 
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

db.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/task', require('./routes/taskRoutes'));

app.get('/tasks', authMiddleware, taskController.renderTasksPage);
app.get('/tasks/new', authMiddleware, taskController.renderNewTaskPage);
app.get('/tasks/edit/:id', authMiddleware, taskController.renderEditTaskPage);

app.get('/login', userController.renderLoginPage); 
app.get('/register', userController.renderRegisterPage);

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const Task = require('../models/Task');
const User = require('../models/User');

const renderTasksPage = (req, res) => {
  res.render('tasks');
}

const create = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user_id: req.user.id });
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create task' });
  }
};

const list = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
      include: User,
    });
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch tasks' });
  }
};

module.exports = {
  renderTasksPage,
  create,
  list,
};

const express = require('express');
const mongoose = require('mongoose');
const todoSchema = require('../schema/todoShema');
const userSchema = require('../schema/userSchema');
const checkLogin = require('../middleware/checkLogin');
const router = express.Router();

const Todo = new mongoose.model('Todo', todoSchema);
const User = new mongoose.model('User', userSchema);

// Get all todos
router.get('/', checkLogin, (req, res) => {
    Todo.find()
        .populate('user', 'name email')
        .select('title description status date user')
        .then(todos => res.json(todos))
        .catch(err => res.status(500).json({ error: 'Failed to fetch todos', details: err }));
});

// Get active todos
router.get('/active', (req, res) => {
    const todo = new Todo();
    todo.findActive()
        .then(todos => res.json(todos))
        .catch(err => res.status(500).json({ error: 'Failed to fetch active todos', details: err }));
});

// Get todos by node in title
router.get('/node', (req, res) => {
    Todo.findByNode()
        .then(todos => res.json(todos))
        .catch(err => res.status(500).json({ error: 'Failed to fetch todos by status', details: err }));
});

// Get todos by language in title
router.get('/language', (req, res) => {
    Todo.find().byLanguage('js')
        .then(todos => res.json(todos))
        .catch(err => res.status(500).json({ error: 'Failed to fetch todos by language', details: err }));
});
// Get a new todo
router.get('/:id', (req, res) => {
    Todo.findById(req.params.id)
        .select('title description status date')
        .then(todo => {
            if (!todo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.json(todo);
        })
});

// Create a new todo
router.post('/', checkLogin, async (req, res) => {
    try {
        const { title, description, status, userId } = req.body;

        const newTodo = new Todo({
            title,
            description,
            status,
            user: req.userId
        });
        const todo = await newTodo.save();
        // Update the user's todos array
        await User.findByIdAndUpdate(req.userId, { $push: { todos: todo._id } });
        res.json({ message: 'Todo created successfully', todo });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create todo', details: err });
    }
});

// Create bulk todos
router.post('/bulk', (req, res) => {
    Todo.insertMany(req.body)
        .then(() => res.json({ message: 'Bulk todos created successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to create bulk todos', details: err }));
});

// Update a todo
router.put('/:id', (req, res) => {
    Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(todo => {
            if (!todo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.json({ message: 'Todo updated successfully', todo });
        })
        .catch(err => res.status(500).json({ error: 'Failed to update todo', details: err }));
});

// Delete a todo
router.delete('/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
        .then(todo => {
            if (!todo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.json({ message: 'Todo deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: 'Failed to delete todo', details: err }));
});

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const todoSchema = require('../schema/todoShema');
const router = express.Router();

const Todo = new mongoose.model('Todo', todoSchema);

// Get all todos
router.get('/', (req, res) => {
    console.log('Get all todos');
    res.json({ message: 'Get all todos' });
});

// Get a new todo
router.get('/:id', (req, res) => {
    res.json({ message: 'Get a new todo' });
});

// Create a new todo
router.post('/', (req, res) => {
    const newTodo = Todo(req.body);
    newTodo.save()
        .then(() => res.json({ message: 'Todo created successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to create todo', details: err }));
});

router.post('/bulk', (req, res) => {
    Todo.insertMany(req.body)
        .then(() => res.json({ message: 'Bulk todos created successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to create bulk todos', details: err }));
});

// Update a todo
router.put('/:id', (req, res) => {
    res.json({ message: 'Update a todo' });
});

// Delete a todo
router.delete('/:id', (req, res) => {
    res.json({ message: 'Delete a todo' });
});

module.exports = router;
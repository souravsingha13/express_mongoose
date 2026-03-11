const express = require('express');
const mongoose = require('mongoose');
const todoSchema = require('../schema/todoShema');
const router = express.Router();

const Todo = new mongoose.model('Todo', todoSchema);

// Get all todos
router.get('/', (req, res) => {
    Todo.find()
        .select('title description status date')
        .then(todos => res.json(todos))
        .catch(err => res.status(500).json({ error: 'Failed to fetch todos', details: err }));
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
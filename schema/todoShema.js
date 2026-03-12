const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

todoSchema.methods = {
    findActive: function () {
        return this.model('Todo').find({ status: 'active' });
    }
}

module.exports = todoSchema;
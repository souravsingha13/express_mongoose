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
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

todoSchema.methods = {
    findActive: function () {
        return this.model('Todo').find({ status: 'active' });
    }
}

todoSchema.statics = {
    findByNode: function () {
        return this.find({ title: /node/i });
    }
}

todoSchema.query = {
    byLanguage: function (language) {
        return this.find({ title: new RegExp(language, 'i') });
    }
}

module.exports = todoSchema;
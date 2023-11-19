const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
    id: {
        type: Number,
        required: true,
        min: 1
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

const Course = model('Course', courseSchema);

module.exports = Course;
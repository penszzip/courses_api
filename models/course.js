const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
    id: {
        type: Number,
        required: true,
        min: 1
    },
    code: {
        type: String,
        required: true,
        minLength: 5 
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

courseSchema.pre(['find', 'findOne', 'findOneAndUpdate', 'findOneAndDelete'], function () {
    this.select('-_id -__v');
});

const Course = model('Course', courseSchema);

module.exports = Course;
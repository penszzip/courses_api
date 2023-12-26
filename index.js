if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const { validateReq } = require('./middleware');
const mongoose = require('mongoose');

const Course = require('./models/course');
const catchAsync = require('./catchAsync');

app.use(express.json());

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`You\'re on port ${port}...`);
});

app.get('/api/courses', catchAsync(async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
}))

app.post('/api/courses', validateReq, catchAsync(async (req, res) => {
    const courses = await Course.find({}) 
    const dbLen = courses[courses.length - 1].id;
    const course = {
        id: dbLen + 1,
        ...req.body
    };
    const newCourse = new Course(course);
    await newCourse.save();

    const courseObject = newCourse.toObject();
    delete courseObject._id;
    delete courseObject.__v;

    res.json(courseObject);
}))

app.get('/api/courses/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findOne({id});
    if (!course) {
        res.status(404).send('The course with the given ID does not exist.')
    } else {
        res.json(course);
    }
}))

app.put('/api/courses/:id', validateReq, catchAsync(async (req,res) => {
    const { id } = req.params;
    const course = await Course.findOneAndUpdate({ id }, req.body, { runValidators: true, new: true });
    if (!course) {
        res.status(404).send('The course with the given ID does not exist.')
    } else {
        res.json(course);
    }
}))

app.delete('/api/courses/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findOneAndDelete({ id });
    if (!course) {
        res.status(404).send('The course with the given ID does not exist.')
    } else {
        res.json(course);
    }
}))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})
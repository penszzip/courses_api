if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const { v4: uuid } = require('uuid');
const { validateReq } = require('./middleware');
const mongoose = require('mongoose');

const Course = require('./models/course')

app.use(express.json());

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const courses = [
    { id: 1, name: 'CPS109' },
    { id: 2, name: 'CPS209' },
    { id: 3, name: 'CPS310' },
]

findCourse = (req, res, next) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID does not exist.');
    } else {
        next();
    }
}

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`You\'re on port ${port}...`);
});

app.get('/api/courses', async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
})

app.post('/api/courses', async (req, res) => {
    const dbLen = (await Course.find({})).length;
    const course = {
        id: dbLen + 1,
        ...req.body
    };
    const newCourse = new Course(course);
    await newCourse.save();
    res.json(newCourse);
})

app.get('/api/courses/:id', async (req, res) => {
    const id = req.params.id;
    const course = await Course.findOne({id});
    res.json(course);
})

app.put('/api/courses/:id', validateReq, findCourse, (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', findCourse, (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
})

app.listen(port, () => {
    console.log(`listening of port ${port}...`);
})
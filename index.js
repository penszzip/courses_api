const express = require('express');
const app = express();
const { v4: uuid } = require('uuid');
const { validateReq } = require('./middleware')

app.use(express.json());

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

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.post('/api/courses', validateReq, (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

app.get('/api/courses/:id', findCourse, (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    res.send(course);
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
    console.log(`listening of port ${port}...`)
})
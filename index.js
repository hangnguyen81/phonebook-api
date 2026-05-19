require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));

app.use(morgan('dev', {
    skip: (req, res) => req.path === '/info'
}));
app.use(express.json());

app.disable('etag');

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`
        Phonebook has info for ${persons.length} people
        ${date}
    `);
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if (person) {
            res.status(200).json(person);
        } else {
            res.status(404).end();
        }
    });
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

const generateId = () => {
    const ids = persons.map(person => Number(person.id));
    const maxId = Math.max(...ids);
    return String(maxId + 1);
};

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body || !body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        res.status(201).json(savedPerson);
    }).catch(error => {
        console.error('Error saving person:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.static('dist'));
app.use(cors());
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
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        res.status(200).json(person);
    } else {
        res.status(404).end();
    }
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
    const person = req.body;
    if (!person || !person.name || !person.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
    const newPerson = {
        id: generateId(),
        name: person.name,
        number: person.number
    };
    persons = persons.concat(newPerson);
    res.status(201).json(newPerson);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
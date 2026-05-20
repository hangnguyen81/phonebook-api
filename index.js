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
    })
        .catch(error => {
            console.error('Error fetching person:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(() => {
        res.status(204).end();
    })
        .catch(error => next(error));
});


app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body || !body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    Person.findOne({ name: body.name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({
                error: 'name must be unique'
            });
        }
    });

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

app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    if (!body || !body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }

    const person = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => {
            console.error('Error updating person:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const personsRouter = require('express').Router();
const Person = require('../models/person');

personsRouter.get('/', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});

personsRouter.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if (person) {
            res.status(200).json(person);
        } else {
            res.status(404).end();
        }
    })
        .catch(error => next(error));
});

personsRouter.post('/', (req, res, next) => {
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
    }).catch(error => next(error));
});

personsRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(() => {
        res.status(204).end();
    })
        .catch(error => next(error));
});

personsRouter.put('/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;

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
            next(error);
        });
});

module.exports = personsRouter;
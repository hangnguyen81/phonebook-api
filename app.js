const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Person = require('./models/person');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const personsRouter = require('./controllers/persons');

const app = express();
logger.info('Connected to MongoDB', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message);
    });

app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(morgan('tiny'));

app.use('/api/persons', personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
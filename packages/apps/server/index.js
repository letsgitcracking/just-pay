if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const express = require('express');

const app = express();
app.set('port', (process.env.PORT || 5000));

//Routes
const mainRoutes = require('./routes/main');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes which handles requests
app.use('/', mainRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
});

app.listen(app.get('port'), () => console.log(`Server listening on Port: ${app.get('port')}`));
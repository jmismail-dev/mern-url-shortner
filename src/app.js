const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname + '/config/.env.development')
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/', require('./routes'))

app.listen(PORT, () => console.log(`App is running on ${PORT}`))
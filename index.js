require('dotenv').config();
const express = require('express');
const Router = require('./Routes/myRoutes');
const cors = require('cors');

const app = express()
app.use(cors());
app.use(express.json());
app.use('/', Router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server Started...!'))
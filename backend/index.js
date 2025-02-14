require('dotenv').config();
const express = require('express');
const scanRoutes = require('./routes/scanRoutes');

const app = express();
app.use(express.json());
app.use('/api', scanRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));

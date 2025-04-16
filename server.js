require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
require('./mqttClient');

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
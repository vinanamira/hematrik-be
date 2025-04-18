require('dotenv').config();
require('./config/mqttClient');
require('./config/database');
const express = require('express');
const app = express();
const routes = require('./routes/routes');

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => res.send('🟢 Hematrik Backend up and running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
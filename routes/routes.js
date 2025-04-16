const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController.js');
const electricityLogController = require('../controllers/electricityLogController.js');

router.get('/devices', deviceController.getAllDevices);
router.get('/devices/:device_id/logs', electricityLogController.getLogsByDevice);

module.exports = router;
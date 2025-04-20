const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/deviceController');
const electricityLogController = require('../controllers/electricityLogController');
const galonPhotoController = require('../controllers/galonPhotoController');
const { controlDevice } = require('../controllers/deviceController');

// Device 
router.get('/devices', deviceController.getAllDevices);
router.get('/devices/:device_id', deviceController.getDeviceById);

// Electricity log 
router.get('/logs', electricityLogController.getAllLogs);
router.get('/logs/:device_id', electricityLogController.getLogsByDevice);

// Galon photo routes
router.post('/upload-photo', galonPhotoController.uploadPhoto);
router.get('/photos', galonPhotoController.getPhotos);

// Device control route (lampu/dispenser)
router.post('/device/:device_id/control', controlDevice);

module.exports = router;
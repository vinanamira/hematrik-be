const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const deviceController = require('../controllers/deviceController');
const galonPhotoController = require('../controllers/galonPhotoController');
const electricityLogController = require('../controllers/electricityLogController');

// User Routes
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);

// Device Routes
router.get('/devices', deviceController.getDevices);
router.post('/devices', deviceController.createDevice);

// Galon Photo Routes
router.get('/galon-photos', galonPhotoController.getPhotos);
router.post('/galon-photos', galonPhotoController.addPhoto);
router.put('/galon-photos/:id/urgent', galonPhotoController.markAsUrgent);

// Electricity Log Routes
router.get('/electricity-logs', electricityLogController.getLogs);
router.post('/electricity-logs', electricityLogController.addLog);

module.exports = router;

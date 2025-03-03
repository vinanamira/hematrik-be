const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const deviceController = require('../controllers/deviceController');
const galonPhotoController = require('../controllers/galonPhotoController');
const electricityLogController = require('../controllers/electricityLogController');
const { verifyToken } = require('../middleware/authentication');


// User Routes
router.get('/users', verifyToken, userController.getUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Device Routes
router.get('/devices', deviceController.getDevices);
router.post('/devices', deviceController.createDevice);

// Galon Photo Routes
router.get('/galon-photos', galonPhotoController.getPhotos);
router.post('/galon-photos', galonPhotoController.addPhoto);
router.put('/galon-photos/:id/urgent', galonPhotoController.markAsUrgent);

// Electricity Log Routes
router.get('/electricity-logs', verifyToken, electricityLogController.getLogs);
router.post('/electricity-logs', electricityLogController.addLog);

module.exports = router;

const express = require('express');
const router = express.Router();

const device = require('../controllers/deviceController');
const logListrik = require('../controllers/electricityLogController');
const notifikasi = require('../controllers/notificationController');

// Device
router.get('/devices', device.getAllDevices);
router.get('/devices/:device_id', device.getDeviceById);
router.post('/device/:device_id/control', device.controlDevice);

// Electricity Log
router.get('/logs', logListrik.getAllLogs);
router.get('/logs/:device_id', logListrik.getLogsByDevice);

// Electricity Latest Logs
router.get('/latest', logListrik.getAllLatestLogs);
router.get('/latest/:device_id', logListrik.getLatestByDevice);

// Notification
router.get('/notifications', notifikasi.getNotifications);
router.patch('/notifications/:notif_id/send', notifikasi.markAsSent);

module.exports = router;
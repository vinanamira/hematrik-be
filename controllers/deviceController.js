const mqtt = require('../config/mqttClient');

const controllableDevices = ['75AA3A', '939788']; // Dispenser, Lampu

const publishToDevice = (device_id, state) => {
  const topic = `EMON25/tele/${device_id}/LWT`;
  mqtt.publish(topic, state, {}, (err) => {
    if (err) {
      console.error(`[MQTT] Gagal publish ke ${topic}:`, err.message);
    } else {
      console.log(`[MQTT] Publish ke ${topic} dengan payload '${state}'`);
    }
  });
};

const controlDevice = async (req, res) => {
  const { device_id } = req.params;
  const { state } = req.body; // 'online' atau 'offline'

  if (!controllableDevices.includes(device_id)) {
    return res.status(403).json({ message: 'Perangkat tidak dapat dikontrol dari web' });
  }

  if (state !== 'online' && state !== 'offline') {
    return res.status(400).json({ message: 'State harus online atau offline' });
  }

  publishToDevice(device_id, state);
  return res.status(200).json({ message: `Perangkat ${device_id} dikontrol: ${state}` });
};

module.exports = { controlDevice };
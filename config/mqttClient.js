require('dotenv').config();
const mqtt = require('mqtt');
const db = require('../config/database');

const client = mqtt.connect({
  host: process.env.MQTT_HOST,
  port: Number(process.env.MQTT_PORT),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

const baseTopics = process.env.MQTT_TOPICS.split(',').map(t => t.trim());
const topics = baseTopics.flatMap(base => [`${base}/SENSOR`, `${base}/LWT`]);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  topics.forEach(topic => {
    client.subscribe(topic, err => {
      if (err) console.error(`Failed to subscribe ${topic}:`, err);
      else console.log(`Subscribed to ${topic}`);
    });
  });
});

client.on('message', async (topic, message) => {
  const parts = topic.split('/');
  const deviceId = parts[2];      
  const topicType = parts[3];     // 'SENSOR' atau 'LWT'
  const payload = message.toString();

  try {
    if (topicType === 'LWT') {
      const status = payload.toLowerCase(); // 'online' atau 'offline'
      await db.execute(
        'UPDATE Device SET status = ? WHERE device_id = ?',
        [status, deviceId]
      );
      console.log(`[${deviceId}] status → ${status}`);
      return;
    }

    if (topicType === 'SENSOR') {
      let json;
      try {
        json = JSON.parse(payload);
      } catch {
        console.error(`Invalid JSON on ${topic}`);
        return;
      }
      const e = json.ENERGY;
      if (!e) {
        console.warn(`No ENERGY field on ${topic}`);
        return;
      }

      const {
        Total, Yesterday, Today,
        Power, ApparentPower, ReactivePower, Factor,
        Voltage, Current
      } = e;
      const timeRecorded = json.Time || new Date().toISOString();

      await db.execute(
        `INSERT INTO Electricity_Log (
           device_id, total_kwh, today_kwh, yesterday_kwh,
           power, apparent_power, reactive_power, factor,
           voltage, current, time_recorded
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          deviceId,
          Total, Today, Yesterday,
          Power, ApparentPower, ReactivePower, Factor,
          Voltage, Current, timeRecorded
        ]
      );
      console.log(`[${deviceId}] logged ENERGY data`);
    }
  } catch (err) {
    console.error(`Error on ${topic}:`, err.message);
  }
});

module.exports = client;
require('dotenv').config();
const mqtt = require('mqtt');
const db = require('../config/database');

const client = mqtt.connect({
  host: process.env.MQTT_HOST,
  port: Number(process.env.MQTT_PORT),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

const topics = process.env.MQTT_TOPICS.split(',').map(topic => topic.trim());

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  topics.forEach(topic => {
    client.subscribe(topic, err => {
      if (err) console.error(`Failed to subscribe to ${topic}:`, err);
      else console.log(`Subscribed to ${topic}`);
    });
  });
});

client.on('message', async (topic, message) => {
  try {
    const topicParts = topic.split('/');
    const device_id = topicParts[2];
    const payload = message.toString();

    let json;
    try {
      json = JSON.parse(payload);
    } catch {
      json = payload; // Handle Online/Offline string
    }

    if (json === 'Online' || json === 'Offline') {
      await db.execute('UPDATE Device SET status = ? WHERE device_id = ?', [json.toLowerCase(), device_id]);
      return;
    }

    if (json.ENERGY) {
      const { TotalStartTime, Total, Yesterday, Today, Power, ApparentPower, ReactivePower, Factor, Voltage, Current } = json.ENERGY;
      const time = json.Time || new Date().toISOString();

      await db.execute(
        `INSERT INTO Electricity_Log (device_id, total_kwh, today_kwh, yesterday_kwh, power, apparent_power, reactive_power, factor, voltage, current, time_recorded)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [device_id, Total, Today, Yesterday, Power, ApparentPower, ReactivePower, Factor, Voltage, Current, time]
      );
    }
  } catch (err) {
    console.error('MQTT message error:', err);
  }
});
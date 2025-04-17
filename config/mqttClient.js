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
const topics = [];
baseTopics.forEach(base => {
  topics.push(`${base}/SENSOR`);
  topics.push(`${base}/LWT`);
});

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
    const device_code = topicParts[2];
    const topicType = topicParts[3]; // SENSOR atau LWT
    const payload = message.toString();

    // Cari device_id dari database berdasarkan device_code
    const [rows] = await db.execute('SELECT device_id FROM Device WHERE device_code = ?', [device_code]);
    if (!rows.length) {
      console.warn(`Device with code ${device_code} not found in DB`);
      return;
    }
    const device_id = rows[0].device_id;

    if (topicType === 'LWT') {
      const status = payload.toLowerCase();
      await db.execute('UPDATE Device SET status = ? WHERE device_id = ?', [status, device_id]);
      console.log(`🔄 Status updated: ${device_code} → ${status}`);
      return;
    }

    if (topicType === 'SENSOR') {
      let json;
      try {
        json = JSON.parse(payload);
      } catch (err) {
        console.error('Failed to parse SENSOR JSON:', err.message);
        return;
      }

      if (json.ENERGY) {
        const {
          TotalStartTime, Total, Yesterday, Today,
          Power, ApparentPower, ReactivePower, Factor,
          Voltage, Current
        } = json.ENERGY;

        const time = json.Time || new Date().toISOString();

        await db.execute(
          `INSERT INTO Electricity_Log (
            device_id, total_kwh, today_kwh, yesterday_kwh,
            power, apparent_power, reactive_power, factor,
            voltage, current, time_recorded
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            device_id, Total, Today, Yesterday,
            Power, ApparentPower, ReactivePower, Factor,
            Voltage, Current, time
          ]
        );

        console.log(`Logged ENERGY data for ${device_code}`);
      }
    }
  } catch (err) {
    console.error('Error handling MQTT message:', err.message);
  }
});

module.exports = client;
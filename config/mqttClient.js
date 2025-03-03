require('dotenv').config();
const mqtt = require('mqtt');
const db = require('./database'); 

const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_TOPIC = process.env.MQTT_TOPIC;

const client = mqtt.connect(MQTT_BROKER, MQTT_TOPIC);

client.on('connect', () => {
    console.log(`Connected to MQTT Broker: ${MQTT_BROKER}`);
    client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
            console.error('Subscription failed:', err);
        } else {
            console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
        }
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);

    try {
        const data = JSON.parse(message.toString()); 
        const { device_id, voltage, current, kwh } = data;

        if (!device_id || voltage === undefined || current === undefined || kwh === undefined) {
            console.error("Invalid data format:", data);
            return;
        }

        const query = `
            INSERT INTO Electricity_Log (device_id, voltage, current, kwh) 
            VALUES (?, ?, ?, ?)`;
        
        db.query(query, [device_id, voltage, current, kwh], (err, result) => {
            if (err) {
                console.error("Failed to insert into MySQL:", err);
            } else {
                console.log(`Data inserted: device_id=${device_id}, voltage=${voltage}, current=${current}, kwh=${kwh}`);
            }
        });
    } catch (error) {
        console.error("Error parsing MQTT message:", error);
    }
});

module.exports = client;
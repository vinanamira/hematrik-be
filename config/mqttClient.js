const mqtt = require('mqtt');
require('dotenv').config();

const MQTT_BROKER_URL = `${process.env.MQTT_BROKER_URL}:${process.env.MQTT_PORT}`;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

const options = {
    clientId: 'mqtt-explorer-b59e5b32',
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    reconnectPeriod: 300000, 
    clean: true
};

const client = mqtt.connect(MQTT_BROKER_URL, options);

client.on('connect', () => {
    console.log(`Connected to MQTT Broker at ${MQTT_BROKER_URL}`);

    client.subscribe('tasmota/discovery', (err) => {
        if (!err) {
            console.log('Subscribed to topic: masmota/discovery');
        } else {
            console.error('Subscription error:', err);
        }
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message from topic "${topic}": ${message.toString()}`);
});

client.on('error', (err) => {
    console.error('MQTT Connection Error:', err);
});

client.on('close', () => {
    console.warn('MQTT Connection Closed. Reconnecting...');
});

module.exports = client;
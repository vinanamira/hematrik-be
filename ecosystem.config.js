module.exports = {
  apps: [{
    name: "hematrik",
    script: "server.js",
    env: {
      NODE_ENV: "production",
      MQTT_HOST: "mqtt://103.165.222.253",
      MQTT_PORT: 8083,
      MQTT_USERNAME: "rastek",
      MQTT_PASSWORD: "rastek",
      MQTT_TOPICS: "EMON25/tele/75AA3A,EMON25/tele/4B8A13,EMON25/tele/939788"
    }
  }]
};
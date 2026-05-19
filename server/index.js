const express    = require('express');
const mqtt       = require('mqtt');
const cors       = require('cors');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let sensorData = {
  air:   { temperature: null, humidity: null },
  soil:  { moisture: null, light: null },
  water: { ph: null, temperature: null },
  timestamp: null
};

const mqttClient = mqtt.connect(process.env.MQTT_BROKER || 'mqtt://localhost:1883');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('smarteco/sensors/#');
});

mqttClient.on('message', (topic, message) => {
  const data  = JSON.parse(message.toString());
  const layer = topic.split('/')[2];
  sensorData[layer] = { ...sensorData[layer], ...data };
  sensorData.timestamp = new Date().toISOString();
  wss.clients.forEach(client => {
    if (client.readyState === 1)
      client.send(JSON.stringify({ layer, data, timestamp: sensorData.timestamp }));
  });
});

app.get('/api/sensors', (req, res) => res.json(sensorData));

const server = app.listen(process.env.PORT || 3001, () =>
  console.log('Server running on port 3001')
);

const wss = new WebSocketServer({ server });
wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'init', data: sensorData }));
});

# SmartEco-Column Dashboard

An IoT-enabled multi-layer biosystem monitoring platform for environmental education.

## Project Structure
smarteco-column/
├── esp32-firmware/   # ESP32 Arduino code
├── server/           # Node.js backend + MQTT + WebSocket
└── dashboard/        # React.js frontend dashboard

## Tech Stack
- ESP32 (sensor data collection)
- MQTT (data transmission protocol)
- Node.js + Express (backend server)
- React.js + Vite (frontend dashboard)
- WebSocket (real-time updates)

## How to Run
### 1. Start MQTT broker
mosquitto

### 2. Start backend server
cd server
npm install
npm run dev

### 3. Start dashboard
cd dashboard
npm install
npm run dev

### 4. Flash ESP32
Open esp32-firmware/main.ino in Arduino IDE and upload to ESP32.

## Team
SmartEco-Column Project — [Your School Name]

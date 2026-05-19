#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const char* ssid       = "YOUR_WIFI_SSID";
const char* password   = "YOUR_WIFI_PASSWORD";
const char* mqttServer = "YOUR_PC_LOCAL_IP";
const int   mqttPort   = 1883;

#define DHT_PIN        4
#define DHT_TYPE       DHT22
#define SOIL_PIN       34
#define LIGHT_PIN      35
#define PH_PIN         32
#define WATER_TEMP_PIN 5

DHT dht(DHT_PIN, DHT_TYPE);
OneWire oneWire(WATER_TEMP_PIN);
DallasTemperature waterTempSensor(&oneWire);

WiFiClient   espClient;
PubSubClient mqtt(espClient);

void connectWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected: " + WiFi.localIP().toString());
}

void connectMQTT() {
  while (!mqtt.connected()) {
    if (mqtt.connect("SmartEcoColumn")) {
      Serial.println("MQTT connected");
    } else {
      delay(2000);
    }
  }
}

void publishSensorData() {
  StaticJsonDocument<128> doc;
  char payload[128];

  doc["temperature"] = dht.readTemperature();
  doc["humidity"]    = dht.readHumidity();
  char air[128]; serializeJson(doc, air);
  mqtt.publish("smarteco/sensors/air", air);

  doc.clear();
  doc["moisture"] = map(analogRead(SOIL_PIN), 0, 4095, 100, 0);
  doc["light"]    = map(analogRead(LIGHT_PIN), 0, 4095, 0, 1000);
  char soil[128]; serializeJson(doc, soil);
  mqtt.publish("smarteco/sensors/soil", soil);

  waterTempSensor.requestTemperatures();
  doc.clear();
  doc["ph"]          = (analogRead(PH_PIN) * 14.0) / 4095.0;
  doc["temperature"] = waterTempSensor.getTempCByIndex(0);
  char water[128]; serializeJson(doc, water);
  mqtt.publish("smarteco/sensors/water", water);
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  waterTempSensor.begin();
  connectWiFi();
  mqtt.setServer(mqttServer, mqttPort);
  connectMQTT();
}

void loop() {
  if (!mqtt.connected()) connectMQTT();
  mqtt.loop();
  publishSensorData();
  delay(3000);
}

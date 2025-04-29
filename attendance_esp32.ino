#include <Keypad.h>
#include <WiFi.h>
#include <HTTPClient.h>

// WiFi config
const char* ssid = "Nikita";
const char* password = "nikita123";
const char* serverUrl = "https://script.google.com/macros/s/AKfycbz6tU32EjcLARJidjX2G_plRAu8JJqzSWDLi-Yxc1PkwKuuj5sgSyCHnxBSwQHzmzY3/exec";

// Keypad config (4x3 layout)
const byte ROWS = 4;
const byte COLS = 3;
char keys[ROWS][COLS] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'},
  {'*','0','#'}
};

// ESP32 GPIO pin mapping
byte rowPins[ROWS] = {18, 19, 21, 22};   // R1-R4
byte colPins[COLS] = {23, 5, 4};         // C1-C3

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
String studentNumber = "";

void setup() {
  Serial.begin(115200);
  delay(1000);  // Give serial time to initialize

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP: " + WiFi.localIP().toString());
  Serial.println("Enter ID:");
}

void loop() {
  char key = keypad.getKey();
  
  if (key) {
    if (key == '#') {
      sendToServer(studentNumber);
      studentNumber = "";
      Serial.println("Enter ID:");
    } else if (key == '*') {
      studentNumber = "";
      Serial.println("Cleared\nEnter ID:");
    } else {
      studentNumber += key;
      Serial.println("Entered: " + studentNumber);
    }
  }
}

void sendToServer(String studentID) {
  HTTPClient http;
  String fullUrl = String(serverUrl) + "?id=" + studentID;

  http.begin(fullUrl);
  int httpCode = http.GET();

  if (httpCode > 0) {
    Serial.println("HTTP Status Code: " + String(httpCode));
    Serial.println("Server Response: " + http.getString());
  } else {
    Serial.println("HTTP request failed.");
    Serial.println("Error: " + http.errorToString(httpCode));
  }

  http.end();
}


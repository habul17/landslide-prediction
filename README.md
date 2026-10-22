# Landslide Prediction

An IoT landslide monitoring system. Sensors on the slope send readings to ThingSpeak. The backend reads them, works out the landslide risk (Low, Medium or High), saves everything in MySQL, and a web dashboard shows the live readings and history.

This is my part of our final-year project: the backend and the frontend. In the original project, the risk came from an ML model built by my teammates. In this version, `risk.js` uses a simple points-based function instead, so the app runs on its own.

## How the data flows

```
Sensors -> board with WiFi -> ThingSpeak -> Express backend (checks every 20 s)
        -> risk -> MySQL -> REST API -> dashboard
```

**Sensors:** soil moisture, tilt (slope sensor), vibration, temperature and humidity.

## Tech stack

- **Frontend:** HTML, CSS, JavaScript (no frameworks)
- **Backend:** Node.js, Express, REST API
- **Database:** MySQL
- **IoT cloud:** ThingSpeak

## API

| Method | Route                  | What it does                         |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/readings/latest` | The newest reading and its risk      |
| GET    | `/api/readings`        | The last 100 readings, newest first  |

## Run it locally

1. Install MySQL and create the database and table:
   ```bash
   sudo mysql < schema.sql
   ```
2. Create a MySQL user for the app (choose your own password):
   ```bash
   sudo mysql -e "CREATE USER 'landslide'@'localhost' IDENTIFIED BY 'your_password'; GRANT ALL ON landslide.* TO 'landslide'@'localhost';"
   ```
3. Create a free ThingSpeak channel with 5 fields: moisture, tilt, vibration, temperature, humidity.
4. Copy `.env.example` to `.env`, then fill in your MySQL password and your ThingSpeak channel ID and API keys.
5. Install packages and start the server:
   ```bash
   npm install
   npm start
   ```
6. No board connected? In a second terminal, run `node simulate.js` to send fake sensor readings to ThingSpeak.
7. Open http://localhost:3000

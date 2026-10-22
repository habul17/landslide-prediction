require("dotenv").config({ quiet: true }); // load .env first, db.js needs it

const express = require("express");
const pool = require("./db");
const predictRisk = require("./risk");
const fetchReadings = require("./thingspeak");

const app = express();

app.use(express.static("public")); // serve the frontend files


// Get new readings from ThingSpeak, work out the risk, and save them in MySQL
async function syncReadings() {

    try {
        const readings = await fetchReadings();

        for (const r of readings) {
            const risk = predictRisk(r.moisture, r.tilt, r.vibration, r.humidity);

            // entry_id is UNIQUE, so INSERT IGNORE skips readings we already saved
            // ? placeholders: mysql2 fills in the values safely (no SQL injection)
            await pool.query(
                "INSERT IGNORE INTO readings (entry_id, moisture, tilt, vibration, temperature, humidity, risk, measured_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [r.entryId, r.moisture, r.tilt, r.vibration, r.temperature, r.humidity, risk, r.measuredAt]
            );
        }

    } catch (err) {
        console.error("Sync failed:", err.message); // try again on the next round
    }

}


// The newest reading, for the dashboard
app.get("/api/readings/latest", async (req, res) => {

    const [rows] = await pool.query("SELECT * FROM readings ORDER BY entry_id DESC LIMIT 1");

    if (rows.length === 0) {
        return res.status(404).json({ message: "no readings yet" });
    }

    res.json(rows[0]);

});


// The last 100 readings, newest first, for the history page
// Optional filter by risk: /api/readings?risk=High
app.get("/api/readings", async (req, res) => {

    const risk = req.query.risk;

    if (risk === undefined) {
        const [rows] = await pool.query("SELECT * FROM readings ORDER BY entry_id DESC LIMIT 100");
        return res.json(rows);
    }

    if (!["Low", "Medium", "High"].includes(risk)) {
        return res.status(400).json({ message: "risk must be Low, Medium or High" });
    }

    const [rows] = await pool.query(
        "SELECT * FROM readings WHERE risk = ? ORDER BY entry_id DESC LIMIT 100",
        [risk]
    );

    res.json(rows);

});


// Any error in the routes above (for example, the database is down) comes here
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: "something went wrong" });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if (err) {
        console.error("Could not start server:", err.message); // for example, the port is already in use
        process.exit(1);
    }

    console.log(`Server running on http://localhost:${PORT}`);

    syncReadings();                   // once at start
    setInterval(syncReadings, 20000); // then every 20 seconds
});

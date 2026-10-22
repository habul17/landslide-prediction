// Pretends to be the sensor board: sends a random reading to ThingSpeak every 20 seconds.
// Use this when the real board is not connected.
require("dotenv").config({ quiet: true });

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendReading() {

    const fields = {
        field1: random(20, 95),               // soil moisture %
        field2: random(0, 15),                // tilt degrees
        field3: Math.random() < 0.2 ? 1 : 0,  // vibration, shaking 1 in 5 times
        field4: random(18, 32),               // temperature °C
        field5: random(50, 98)                // humidity %
    };

    const params = new URLSearchParams({ api_key: process.env.THINGSPEAK_WRITE_KEY, ...fields });

    try {
        const response = await fetch("https://api.thingspeak.com/update?" + params);
        const entryId = await response.text(); // ThingSpeak replies with the new entry id, or 0 if it failed
        console.log("Sent", fields, "-> entry", entryId);
    } catch (err) {
        console.error("Send failed:", err.message);
    }

}

sendReading();
setInterval(sendReading, 20000); // ThingSpeak free plan allows one update every 15 seconds

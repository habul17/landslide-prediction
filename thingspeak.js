// Reads the sensor readings that the board uploaded to ThingSpeak.
// Channel fields:
//   field1 = soil moisture (%)
//   field2 = tilt from the slope sensor (degrees)
//   field3 = vibration (1 = shaking, 0 = none)
//   field4 = temperature (°C)
//   field5 = humidity (%)

function toInt(value) {
    return Math.round(parseFloat(value)); // ThingSpeak sends text like "45.0", or null if missing
}

async function fetchReadings() {

    const url = `https://api.thingspeak.com/channels/${process.env.THINGSPEAK_CHANNEL_ID}/feeds.json`
        + `?results=10&api_key=${process.env.THINGSPEAK_READ_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("ThingSpeak returned status " + response.status);
    }

    const data = await response.json();

    const readings = [];

    for (const feed of data.feeds) {
        const reading = {
            entryId: feed.entry_id,
            moisture: toInt(feed.field1),
            tilt: toInt(feed.field2),
            vibration: toInt(feed.field3),
            temperature: toInt(feed.field4),
            humidity: toInt(feed.field5),
            measuredAt: new Date(feed.created_at)
        };

        // skip a row if the board did not send every sensor value
        const values = [reading.moisture, reading.tilt, reading.vibration, reading.temperature, reading.humidity];
        if (values.some(Number.isNaN)) {
            continue;
        }

        readings.push(reading);
    }

    return readings;
}

module.exports = fetchReadings;

const message = document.getElementById("message");
const riskBox = document.getElementById("risk");

async function loadLatest() {

    try {
        const response = await fetch("/api/readings/latest");
        const reading = await response.json();

        if (!response.ok) {
            message.textContent = reading.message;
            return;
        }

        message.textContent = "";

        document.getElementById("moisture").textContent = reading.moisture + "%";
        document.getElementById("tilt").textContent = reading.tilt + "°";
        document.getElementById("vibration").textContent = reading.vibration === 1 ? "Shaking" : "None";
        document.getElementById("temperature").textContent = reading.temperature + " °C";
        document.getElementById("humidity").textContent = reading.humidity + "%";
        document.getElementById("time").textContent = new Date(reading.measured_at).toLocaleString();

        riskBox.textContent = "Risk: " + reading.risk;
        riskBox.className = "risk-box risk-" + reading.risk.toLowerCase();

    } catch (err) {
        message.textContent = "Could not reach the server";
    }

}

loadLatest();
setInterval(loadLatest, 20000); // refresh every 20 seconds

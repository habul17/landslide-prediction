const tbody = document.getElementById("history-body");
const message = document.getElementById("message");
const filter = document.getElementById("risk-filter");

async function loadHistory() {

    // "" means All, otherwise ask the API for one risk level only
    const url = filter.value === "" ? "/api/readings" : "/api/readings?risk=" + filter.value;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            message.textContent = "Could not load history";
            return;
        }

        const rows = await response.json();

        tbody.replaceChildren(); // remove the old rows

        message.textContent = rows.length === 0 ? "No readings yet." : "";

        for (const row of rows) {
            const tr = document.createElement("tr");

            addCell(tr, new Date(row.measured_at).toLocaleString());
            addCell(tr, row.moisture + "%");
            addCell(tr, row.tilt + "°");
            addCell(tr, row.vibration === 1 ? "Shaking" : "None");
            addCell(tr, row.temperature + " °C");
            addCell(tr, row.humidity + "%");

            const riskCell = addCell(tr, row.risk);
            riskCell.className = "risk-" + row.risk.toLowerCase();

            tbody.appendChild(tr);
        }

    } catch (err) {
        message.textContent = "Could not reach the server";
    }

}

// textContent (not innerHTML), so the data always shows as plain text
function addCell(tr, text) {
    const td = document.createElement("td");
    td.textContent = text;
    tr.appendChild(td);
    return td;
}

filter.addEventListener("change", loadHistory);

loadHistory();
setInterval(loadHistory, 20000); // refresh every 20 seconds

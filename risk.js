// Stand-in for the team's ML model.
// Gives points for each danger sign, then turns the total into Low / Medium / High.
// Temperature is saved and shown, but it does not change the risk.
function predictRisk(moisture, tilt, vibration, humidity) {

    let score = 0;

    if (moisture >= 80) score += 2;       // soaked soil (%)
    else if (moisture >= 50) score += 1;

    if (tilt >= 10) score += 2;           // ground has tilted a lot (degrees)
    else if (tilt >= 5) score += 1;

    if (vibration === 1) score += 2;      // ground is shaking

    if (humidity >= 90) score += 1;       // very wet air, rain likely (%)

    if (score >= 4) return "High";
    if (score >= 2) return "Medium";
    return "Low";
}

module.exports = predictRisk;

CREATE DATABASE IF NOT EXISTS landslide;

USE landslide;

CREATE TABLE IF NOT EXISTS readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL UNIQUE,     -- ThingSpeak's id for this reading
    moisture INT NOT NULL,            -- soil moisture %
    tilt INT NOT NULL,                -- slope sensor tilt, degrees
    vibration TINYINT NOT NULL,       -- 1 = shaking, 0 = none
    temperature INT NOT NULL,         -- °C
    humidity INT NOT NULL,            -- %
    risk VARCHAR(10) NOT NULL,        -- Low, Medium or High
    measured_at TIMESTAMP NOT NULL    -- when the board sent it
);

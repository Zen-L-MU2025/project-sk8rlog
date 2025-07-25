import haversine from "haversine";
import { LOCATIONS, LOCATIONS_COORDINATES, BASE_PROXIMITY_BIAS } from "./constants.js";

// Calculates distance between two locations in km and generates a proximity bias score based on it
const calculateProximityBias = (locationStringA, locationStringB) => {
    if (locationStringA === LOCATIONS.DEFAULT || locationStringB === LOCATIONS.DEFAULT) return 0;
    if (locationStringA === locationStringB) return BASE_PROXIMITY_BIAS;

    const locationCoordinatesA = LOCATIONS_COORDINATES[locationStringA];
    const locationCoordinatesB = LOCATIONS_COORDINATES[locationStringB];

    const distanceInKM = haversine(locationCoordinatesA, locationCoordinatesB, { unit: "km" });

    // Increases as distance closes, approaches zero as distance increaes
    const proximityBias = BASE_PROXIMITY_BIAS / Math.sqrt(distanceInKM);

    return proximityBias;
};

export default calculateProximityBias;

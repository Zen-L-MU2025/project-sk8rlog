import haversine from "haversine";
import { LOCATIONS, LOCATIONS_COORDINATES, BASE_PROXIMITY_BIAS, NOT_APPLICABLE } from "./constants.js";

// Helper function for the distance calculation
const calculateDistance = (locationStringA, locationStringB) => {
    const locationCoordinatesA = LOCATIONS_COORDINATES[locationStringA];
    const locationCoordinatesB = LOCATIONS_COORDINATES[locationStringB];

    return haversine(locationCoordinatesA, locationCoordinatesB, { unit: "km" });
};

// Calculates distance between two locations in km and generates a proximity bias score based on it
const calculateProximityBias = (post, locationStringA, locationStringB) => {
    const doesNotApply = locationStringA === LOCATIONS.DEFAULT || locationStringB === LOCATIONS.DEFAULT;

    const distanceInKM = doesNotApply ? NOT_APPLICABLE : calculateDistance(locationStringA, locationStringB);
    post["distanceFromUser"] = distanceInKM;

    // Proximity score base cases
    if (doesNotApply) return 0;
    if (locationStringA === locationStringB) return BASE_PROXIMITY_BIAS;

    // Increases as distance closes, approaches zero as distance increaes
    const proximityBias = BASE_PROXIMITY_BIAS / Math.sqrt(distanceInKM);

    return proximityBias;
};

export default calculateProximityBias;

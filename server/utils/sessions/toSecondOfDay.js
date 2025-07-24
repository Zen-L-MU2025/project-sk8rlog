import { SECONDS_IN_MINUTE, SECONDS_IN_HOUR } from "../constants.js";

// Converts a date object to a number of seconds since midnight
const toSecondOfDay = (date) => {
    return date.getHours() * SECONDS_IN_HOUR + date.getMinutes() * SECONDS_IN_MINUTE + date.getSeconds();
};

export default toSecondOfDay;

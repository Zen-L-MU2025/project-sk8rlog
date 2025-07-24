/* GENERAL */

// Video upload file types used in Clip creation
export const QUICKTIME = "quicktime";
export const MOV = "mov";

// Used across recommendation utilities to drop values as needed
export const NOT_APPLICABLE = -1;

/**********************************************/

/* TIME */

/*
Guide to cron interval strings (from node-cron docs):
┌────────────── second (optional)
│ ┌──────────── minute
│ │ ┌────────── hour
│ │ │ ┌──────── day of month
│ │ │ │ ┌────── month
│ │ │ │ │ ┌──── day of week
│ │ │ │ │ │
│ │ │ │ │ │
* * * * * *
To specify an amount at any position, append /<number> to the star (*)
Leaving all stars (*) will default to every minute
*/
export const CRON_INTERVAL_STRING = "*/15 * * * * *";
export const CRON_INTERVAL_DESCRIPTOR = "15 seconds";

// Key values used in timing calculations
const SECONDS_IN_MINUTE = 60;
export const MILLISECONDS_IN_DAY = 86400000;
export const HALF_HOUR_IN_SECONDS = 30 * SECONDS_IN_MINUTE;
export const MIDDLE_OF_DAY_IN_SECONDS = 12 * 60 * SECONDS_IN_MINUTE;

/**********************************************/

/* RECOMMENDATION AND RANKING */

// Used in post recommendation utilities
export const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9]/;
export const BLOGS = "Blogs";
export const CLIPS = "Clips";
export const RANKING_MODES = {
    RECOMMENDED: "reccommended",
    LATEST: "latest",
    POPULAR: "popular",
    NEAR_YOU: "near_you",
    DEFAULT: "default",
};
export const AGE_CUTOFF_IN_DAYS = 7;
export const LIKE_WEIGHT = 0.1;
export const COMMENT_WEIGHT = 0.33;
const AVERAGE_WORDS_READ_PER_MINUTE = 230;
export const AVERAGE_WORDS_READ_PER_SECOND = AVERAGE_WORDS_READ_PER_MINUTE / SECONDS_IN_MINUTE;

// Used in profile ranking
export const POST_OVERALL_WEIGHT = 0.7;
export const POPULARITY_OVERALL_WEIGHT = 0.3;
export const NO_CORRELATION = 0.0;
export const SUGGESTION_RECENCY_CUTOFF_IN_DAYS = 2;

// Used in profile ranking -> meaningful interaction metric
export const RELEVANCY_CUTOFF = 5;
export const LIKE_POINT_VALUE = 1;
export const COMMENT_POINT_VALUE = 3;
export const INTERACTION_POINTS_THRESHOLD = 4;
export const MEANINFUL_INTERACTION_BONUS = 3;

// Used in profile ranking -> user timing metric
export const USER_TIMING_BONUS = 2;

/**********************************************/

/* EVENT TYPES */

// App interaction event types used in endpoints and interaction metric calculations
export const LIKE = "like";
export const COMMENT = "comment";
export const CREATE = "create";
export const FOLLOW = "follow";
export const UNFOLLOW = "unfollow";

// WebSocket event types
export const CONNECTION = "connection";
export const DISCONNECT = "disconnect";
export const REQUEST_NOTIFICATION = "request notification";
export const ENTER_ROOM = "enter room";
export const DELIVER_NOTIFICATION = "deliver notification";
// DELIVER_NOTIFICATION subtypes
export const USER_SUGGESTION = "user suggestion";
export const POST_SUGGESTION = "post suggestion";

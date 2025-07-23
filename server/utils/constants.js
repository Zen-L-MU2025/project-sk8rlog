export const QUICKTIME = "quicktime";
export const MOV = "mov";

export const LIKE = "like";
export const COMMENT = "comment";
export const CREATE = "create";

export const CONNECTION = "connection";
export const DISCONNECT = "disconnect";
export const REQUEST_NOTIFICATION = "request notification";
export const DELIVER_NOTIFICATION = "deliver notification";
export const ENTER_ROOM = "enter room";

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

export const CLIPS = "Clips";

export const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9]/;
export const MILLISECONDS_IN_DAY = 86400000;
export const AGE_CUTOFF_IN_DAYS = 7;
export const LIKE_WEIGHT = 0.1;
export const COMMENT_WEIGHT = 0.33;

const SECONDS_IN_MINUTE = 60;
export const HALF_HOUR_IN_SECONDS = 30 * SECONDS_IN_MINUTE;
export const MIDDLE_OF_DAY_IN_SECONDS = 12 * 60 * SECONDS_IN_MINUTE;

const AVERAGE_WORDS_READ_PER_MINUTE = 230;
export const AVERAGE_WORDS_READ_PER_SECOND = AVERAGE_WORDS_READ_PER_MINUTE / SECONDS_IN_MINUTE;

export const NOT_APPLICABLE = -1;

export const RANKING_MODES = {
    RECOMMENDED: "reccommended",
    LATEST: "latest",
    POPULAR: "popular",
    NEAR_YOU: "near_you",
    DEFAULT: "default",
};

export const FOLLOW = "follow";
export const UNFOLLOW = "unfollow";

export const POST_OVR_WEIGHT = 0.7;
export const POPULARITY_OVR_WEIGHT = 0.3;
export const NO_CORRELATION = 0.0;

export const RECENCY_CUTOFF_IN_DAYS = 2;

export const RELEVANCY_CUTOFF = 5;
export const MEANINFUL_INTERACTION_BONUS = 3;
export const LIKE_POINT_VALUE = 1;
export const COMMENT_POINT_VALUE = 3;
export const INTERACTION_POINTS_THRESHOLD = 4;
export const USER_TIMING_BONUS = 2;

export const USER_SUGGESTION = "user suggestion";
export const POST_SUGGESTION = "post suggestion";

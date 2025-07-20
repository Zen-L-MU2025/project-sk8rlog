export const QUICKTIME = "quicktime";
export const MOV = "mov";

export const LIKE = "like";
export const COMMENT = "comment";
export const CREATE = "create";

export const CONNECTION = "connection";
export const DISCONNECT = "disconnect";
export const REQUEST_NOTIFICATION = "request notification";
export const DELIVER_NOTIFICATION = "deliver notification";
export const PING_INTERVAL = 5000;
export const ROLL_THRESHOLD = 0.7;

export const CLIPS = "Clips";

export const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9]/;
export const MILLISECONDS_IN_DAY = 86400000;
export const AGE_CUTOFF_IN_DAYS = 7;
export const LIKE_WEIGHT = 0.1;
export const COMMENT_WEIGHT = 0.33;

const AVERAGE_WORDS_READ_PER_MINUTE = 230;
const SECONDS_IN_MINUTE = 60;
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

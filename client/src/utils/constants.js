export const CLIPS = "Clips";
export const BLOGS = "Blogs";
export const DEFAULT = "default";

export const toSingular = (arg) => {
    if (arg === CLIPS) {
        return "Clip";
    }

    if (arg === BLOGS) {
        return "Blog";
    }
};

export const WEEKDAYS = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};

export const HOME_PAGE_POST_COUNT = 4;

const CLIPS_ORIGIN = "c";
const BLOGS_ORIGIN = "b";

export const POSTS = {
    Clips: CLIPS_ORIGIN,
    Blogs: BLOGS_ORIGIN,
};
export const HOME_ORIGIN = "h";
export const PROFILE_ORIGIN = "u";

export const ORIGINS = {
    [CLIPS_ORIGIN]: "clips",
    [BLOGS_ORIGIN]: "blogs",
    [HOME_ORIGIN]: "home",
    [PROFILE_ORIGIN]: "profile",
};

export const PROFILE_NOT_APPLICABLE = "_";

export const LIKE = "like";
export const UNLIKE = "unlike";

export const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9]/;

export const MILLISECONDS_IN_DAY = 86400000;
export const AGE_CUTOFF_IN_DAYS = 7;

export const NOT_APPLICABLE = -1;

export const RANKING_MODES = {
    RECOMMENDED: "reccommended",
    LATEST: "latest",
    POPULAR: "popular",
    NEAR_YOU: "near_you",
    DEFAULT: "default",
};

export const CONNECT = "connect";
export const DISCONNECT = "disconnect";
export const REQUEST_NOTIFICATION = "request notification";
export const DELIVER_NOTIFICATION = "deliver notification";

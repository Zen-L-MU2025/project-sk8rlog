/* GENERAL */

// Sign-In Options
export const OPTIONS = {
    LOGIN: "login",
    REGISTER: "register",
};

// Post types to dictate views in app
export const CLIPS = "Clips";
export const BLOGS = "Blogs";
export const POST_TYPE_DEFAULT = "default";

// Converts to singular form of post type for styling
export const toSingular = (arg) => {
    if (arg === CLIPS) {
        return "Clip";
    }

    if (arg === BLOGS) {
        return "Blog";
    }
};

// Used to stylize app greeting in Header
export const WEEKDAYS = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};

// Limits number of posts that load on Home page
export const HOME_PAGE_POST_COUNT = 4;

/**********************************************/

/* PAGINATION */

// Utility constants to handle redirection logic in client, largely concerning the "Go Back" button
const CLIPS_ORIGIN = "c";
const BLOGS_ORIGIN = "b";
export const POST_ORIGINS = {
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
export const PROFILE_ORIGIN_NOT_APPLICABLE = "_";

/**********************************************/

/* RECOMMENDATION HELPERS */

// Regex for post tokenization
export const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9]/;

// For filtering posts
export const RANKING_MODES = {
    RECOMMENDED: "reccommended",
    LATEST: "latest",
    POPULAR: "popular",
    NEAR_YOU: "near_you",
    DEFAULT: "default",
};

/**********************************************/

/* EVENT TYPES */

// App interaction event types
export const LIKE = "like";
export const UNLIKE = "unlike";
export const FOLLOW = "follow";
export const UNFOLLOW = "unfollow";

// WebSocket event types
export const CONNECT = "connect";
export const DISCONNECT = "disconnect";
export const REQUEST_NOTIFICATION = "request notification";
export const ENTER_ROOM = "enter room";
export const DELIVER_NOTIFICATION = "deliver notification";
// DELIVER_NOTIFICATION subtypes
export const USER_SUGGESTION = "user suggestion";
export const POST_SUGGESTION = "post suggestion";

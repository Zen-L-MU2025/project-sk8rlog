export const CLIPS = "Clips"
export const BLOGS = "Blogs"
export const DEFAULT = 'default'

export const toSingular = (arg) => {
    if (arg === CLIPS) {
        return 'Clip'
    }

    if (arg === BLOGS) {
        return 'Blog'
    }
}

export const WEEKDAYS = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
}

export const HOME_PAGE_POST_COUNT = 4

const CLIPS_ORIGIN = "c"
const BLOGS_ORIGIN = "b"

export const POSTS = {
    "Clips": CLIPS_ORIGIN,
    "Blogs": BLOGS_ORIGIN
}
export const HOME_ORIGIN = "h"
export const PROFILE_ORIGIN = "u"

export const ORIGINS = {
    [CLIPS_ORIGIN]: "clips",
    [BLOGS_ORIGIN]: "blogs",
    [HOME_ORIGIN]: "home",
    [PROFILE_ORIGIN]: "profile"
}

export const LIKE = "like"
export const UNLIKE = "unlike"

export const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9]/

export const MILLISECONDS_IN_DAY = 86400000
export const AGE_CUTOFF_IN_DAYS = 7

export const LIKE_WEIGHT = 0.1
export const COMMENT_WEIGHT = 0.33
export const CLIP_DESCRIPTION_WEIGHT = 0.33
export const AVERAGE_WORDS_READ_PER_MINUTE = 230
export const SECONDS_IN_MINUTE = 60

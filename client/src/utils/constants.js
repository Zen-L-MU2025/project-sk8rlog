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

import { MILLISECONDS_IN_DAY, AGE_CUTOFF_IN_DAYS } from "../../constants.js";

// Filters out posts that are older than AGE_CUTOFF_IN_DAYS (7) days
const filterPostsByCutoff = (posts) => {
    return posts?.filter((post) => {
        const postAgeInMS = new Date() - new Date(post.creationDate);
        const postAgeInDays = Math.floor(postAgeInMS / MILLISECONDS_IN_DAY);
        post["ageInDays"] = postAgeInDays;
        return postAgeInDays < AGE_CUTOFF_IN_DAYS;
    });
};

export default filterPostsByCutoff;

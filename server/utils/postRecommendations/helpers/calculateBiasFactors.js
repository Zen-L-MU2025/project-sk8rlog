import { PrismaClient } from "../../../generated/prisma/index.js";
import { CLIPS, NOT_APPLICABLE } from "../../constants.js";
import getPostLength from "./getPostLength.js";

const prisma = new PrismaClient();

/*
Calculates:
    - the portion of the user's liked posts that are clips
    - the average length of the user's liked posts

Returns an object containing both statistics
*/
const calculateBiasFactors = async (activeUser) => {
    if (!activeUser.likedPosts?.length) {
        return { portionOfLikedPostsThatAreClips: NOT_APPLICABLE, avgLengthOfLikedPosts: NOT_APPLICABLE };
    }

    let likedClips = 0;
    let likedBlogs = 0;
    let totalLikedContentLength = 0;
    const likedPostsCount = activeUser.likedPosts.length;

    for (const postID of activeUser.likedPosts) {
        const post = await prisma.post.findUnique({ where: { postID } });

        totalLikedContentLength += await getPostLength(post);

        post?.type === CLIPS ? likedClips++ : likedBlogs++;
    }

    if (likedClips + likedBlogs !== likedPostsCount) {
        console.error("findPortionOfLikedPostsThatAreClips: Liked post type distinctions don't add up to total number of liked posts");
    }

    const portionOfLikedPostsThatAreClips = likedClips / likedPostsCount;
    const avgLengthOfLikedPosts = totalLikedContentLength / likedPostsCount;

    return { portionOfLikedPostsThatAreClips, avgLengthOfLikedPosts };
};

export default calculateBiasFactors;

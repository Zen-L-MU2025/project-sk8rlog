import { PrismaClient } from "../../generated/prisma/index.js";
import evaluateCandidate from "./evaluateCandidate.js";

const prisma = new PrismaClient();

// Rank suggestion candidates for some user and return candidates in descending order of score
const rankCandidates = async (hostUserID) => {
    const user = await prisma.user.findUnique({ where: { userID: hostUserID } });
    // No passwords
    delete user.password;

    let candidates = await prisma.user.findMany({
        where: { userID: { not: hostUserID, notIn: user.followedUsers } },
    });

    for (const candidate of candidates) {
        // No passwords
        delete candidate.password;
        candidate["candidacyScore"] = await evaluateCandidate(user, candidate);
    }

    candidates.sort((a, b) => b.candidacyScore - a.candidacyScore);

    return candidates;
};

export default rankCandidates;

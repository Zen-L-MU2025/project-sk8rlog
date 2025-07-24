const router = require("express").Router();
const rankCandidates = require("../utils/profileRanking/rankCandidates").default;
const STATUS_CODES = require("../statusCodes");

router.get("/acquireCandidates/for/:userID", async (req, res) => {
    try {
        const { userID } = req.params;
        const rankedCandidates = await rankCandidates(userID);
        return res.status(STATUS_CODES.OK).json(rankedCandidates);
    } catch (error) {
        res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message });
    }
});

module.exports = router;

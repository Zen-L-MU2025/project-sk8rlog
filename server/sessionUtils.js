const MS_IN_SECOND = 1000
const MINUTES_IN_HOUR = 60
const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = MINUTES_IN_HOUR * SECONDS_IN_MINUTE

import { LIKE, COMMENT, CREATE } from './constants.js'

// Converts a date object to a number of seconds since midnight
const toSecondOfDay = (date) => {
    return date.getHours() * SECONDS_IN_HOUR + date.getMinutes() * SECONDS_IN_MINUTE + date.getSeconds()
}

// Recalculates the average session time, start time, and end time based on provided user's session data
export const recalculateSessionAverages = async (userID, prisma) => {
    const userSessionData = await prisma.sessionData.findUnique({
        where: { userID },
    })

    let { sessionCount, averageSessionTime, lastSessionStartTime, averageSessionStartTime, averageSessionEndTime } = userSessionData

    const logoutTime = new Date()

    const sessionDurationInSeconds = (logoutTime.getTime() - lastSessionStartTime.getTime()) / MS_IN_SECOND

    // Recalculate the user's average session start time as the nth second of the day
    const avgStartAsSecondOfDay = averageSessionStartTime || 0
    const lastSessionStartAsSecondOfDay = toSecondOfDay(lastSessionStartTime)
    const newAverageSessionStartTimeAsSecondOfDay = ((avgStartAsSecondOfDay * sessionCount) + lastSessionStartAsSecondOfDay) / (sessionCount + 1)

    // Recalculate the user's average session end time as the nth second of the day
    const avgEndAsSecondOfDay = averageSessionEndTime || 0
    const lastSessionEndAsSecondOfDay = toSecondOfDay(logoutTime)
    const newAverageSessionEndTimeAsSecondOfDay = ((avgEndAsSecondOfDay * sessionCount) + lastSessionEndAsSecondOfDay) / (sessionCount + 1)

    // Round new averages to finalize
    const newSessionCount = sessionCount + 1
    const newAverageSessionTime = Math.ceil(((averageSessionTime * sessionCount) + sessionDurationInSeconds) / (sessionCount + 1))
    const newAverageSessionStartTime = Math.floor(newAverageSessionStartTimeAsSecondOfDay)
    const newAverageSessionEndTime = Math.ceil(newAverageSessionEndTimeAsSecondOfDay)

    await prisma.sessionData.update({
        where: { userID },
        data: {
            sessionCount: newSessionCount,
            averageSessionTime: newAverageSessionTime,
            averageSessionStartTime: newAverageSessionStartTime,
            averageSessionEndTime: newAverageSessionEndTime,
        }
    })
}

// Recalculates the metrics of the specified interaction type based on provided user's interaction data
export const recalculateInteractionAverages = async (userID, prisma, interactionType) => {
    const userInteractionData = await prisma.interactionData.findUnique({
        where: { userID }
    })

    let {
        likeInteractionCount, averageLikeInteractionTime,
        commentInteractionCount, averageCommentInteractionTime,
        createInteractionCount, averageCreateInteractionTime,
    } = userInteractionData

    const now = new Date()
    const interactionTimeAsSecondOfDay =  toSecondOfDay(now)


    let avgInteractionTime, interactionCount

    switch (interactionType) {
        case LIKE:
            avgInteractionTime = averageLikeInteractionTime || 0
            interactionCount = likeInteractionCount
            break

        case COMMENT:
            avgInteractionTime = averageCommentInteractionTime || 0
            interactionCount = commentInteractionCount
            break

        case CREATE:
            avgInteractionTime = averageCreateInteractionTime || 0
            interactionCount = createInteractionCount
            break

        default: throw new Error(`Invalid interaction type: ${interactionType}`)
    }

    const newAverage = Math.ceil(((avgInteractionTime * interactionCount) + interactionTimeAsSecondOfDay) / (interactionCount + 1))
    const newInteractionCount = interactionCount + 1

    let data = {}

    switch (interactionType) {
        case LIKE:
            data = { likeInteractionCount: newInteractionCount, averageLikeInteractionTime: newAverage }
            break

        case COMMENT:
            data = { commentInteractionCount: newInteractionCount, averageCommentInteractionTime: newAverage }
            break

        case CREATE:
            data = { createInteractionCount: newInteractionCount, averageCreateInteractionTime: newAverage }
            break

        default: throw new Error(`Invalid interaction type: ${interactionType}`)
    }

    await prisma.interactionData.update({
        where: { userID }, data : data
    })

}

export const QUICKTIME = 'quicktime'
export const MOV = 'mov'

const MS_IN_SECOND = 1000
const MINUTES_IN_HOUR = 60
const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = MINUTES_IN_HOUR * SECONDS_IN_MINUTE

// Converts a date object to a number of seconds since midnight
const toSecondOfDay = (date) => {
    return date.getHours() * SECONDS_IN_HOUR + date.getMinutes() * SECONDS_IN_MINUTE + date.getSeconds()
}

// Recalculates the average session time, start time, and end time based on provided user session data
export const recalculateAverages = (userSessionData) => {
    const logoutTime = new Date()
    let { sessionCount, averageSessionTime, lastSessionStartTime, averageSessionStartTime, averageSessionEndTime } = userSessionData

    const sessionDurationInSeconds = (logoutTime.getTime() - lastSessionStartTime.getTime()) / MS_IN_SECOND

    const avgStartAsSecondOfDay = averageSessionStartTime || 0
    const lastSessionStartAsSecondOfDay = toSecondOfDay(lastSessionStartTime)
    const newAverageSessionStartTimeAsSecondOfDay = ((avgStartAsSecondOfDay * sessionCount) + lastSessionStartAsSecondOfDay) / (sessionCount + 1)

    const avgEndAsSecondOfDay = averageSessionEndTime || 0
    const lastSessionEndAsSecondOfDay = toSecondOfDay(logoutTime)
    const newAverageSessionEndTimeAsSecondOfDay = ((avgEndAsSecondOfDay * sessionCount) + lastSessionEndAsSecondOfDay) / (sessionCount + 1)

    const today = new Date()
    const todayAtMidnightAsSecondsSinceEpoch = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / MS_IN_SECOND

    const newSessionCount = sessionCount + 1
    const newAverageSessionTime = Math.ceil(((averageSessionTime * sessionCount) + sessionDurationInSeconds) / (sessionCount + 1))
    const newAverageSessionStartTime = Math.floor(todayAtMidnightAsSecondsSinceEpoch + newAverageSessionStartTimeAsSecondOfDay)
    const newAverageSessionEndTime = Math.ceil(todayAtMidnightAsSecondsSinceEpoch + newAverageSessionEndTimeAsSecondOfDay)

    return { newSessionCount, newAverageSessionTime, newAverageSessionStartTime, newAverageSessionEndTime }
}

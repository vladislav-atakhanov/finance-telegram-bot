/** @type {Map<number, (m: import("./@types.ts").Message) => void>} */
const answerWaiters = new Map()

/**
 * @param {number} chatId
 * @returns {Promise<import("./@types.ts").Message>}
 */
export const getAnswer = (chatId) =>
    new Promise((resolve) => answerWaiters.set(chatId, resolve))

/** @param {import("./@types.ts").Message} message */
export const checkAnswer = (message) => {
    const chatId = message.chat.id
    if (answerWaiters.has(chatId) === false) return false
    const resolve = answerWaiters.get(chatId)
    resolve(message)
    answerWaiters.delete(chatId)
    return true
}

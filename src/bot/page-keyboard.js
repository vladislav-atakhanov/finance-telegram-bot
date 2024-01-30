/**
 *
 * @param {number} min
 * @param {number} current
 * @param {number} max
 */
const rotateNumber = (min, current, max) => {
    const range = max - min + 1
    current = (((current - min) % range) + range) % range
    return current + min
}

/** @type {Map<string, number>} */
const currentPages = new Map()
/**
 *
 * @param {number} messageId
 * @param {number} chatId
 */
const MessageId = (messageId, chatId) => `${messageId}@${chatId}`

/**
 * @param {number} messageId
 * @param {number} chatId
 * @param {number} currentPage
 */
export const setCurrentPage = (messageId, chatId, currentPage) =>
    currentPages.set(MessageId(messageId, chatId), currentPage)

/**
 * @param {number} messageId
 * @param {number} chatId
 */
export const getCurrentPage = (messageId, chatId) =>
    currentPages.get(MessageId(messageId, chatId))

/**
 *
 * @param {number} currentIndex
 * @param {number} totalCount
 * @param {string} callbackPrefix
 * @returns {import("node-telegram-bot-api").InlineKeyboardMarkup}
 */
export const PageKeyboard = (currentIndex, totalCount, callbackPrefix) => {
    const prevIndex = rotateNumber(0, currentIndex - 1, totalCount - 1)
    const nextIndex = rotateNumber(0, currentIndex + 1, totalCount - 1)

    const row = [
        {
            text: "<",
            callback_data: `${callbackPrefix}:${prevIndex}`,
        },
        {
            text: `${currentIndex + 1}/${totalCount}`,
            callback_data: " ",
        },
        {
            text: ">",
            callback_data: `${callbackPrefix}:${nextIndex}`,
        },
    ]

    return { inline_keyboard: [row] }
}

import { getAnswer } from "../bot/index.js"
import { getAllCategories, insertCategory } from "../database/index.js"

/**
 * @param {import("node-telegram-bot-api")} bot
 * @param {number} chatId
 * @param {number} fromId
 * @param {number} toId
 */
export const deleteMessagesFromId = (bot, chatId, fromId, toId) =>
    Promise.all(
        new Array(toId - fromId + 1).fill(1).map(async (_, index) => {
            const messageId = index + fromId
            try {
                await bot.deleteMessage(chatId, messageId)
            } catch (e) {}
        })
    )

/** @param {number} [messageId] */
export const RemoveButton = (messageId) => ({
    inline_keyboard: [
        [{ text: "Удалить", callback_data: `remove${messageId ?? ""}` }],
    ],
})

/** @type {Map<number, number>} */
export const lastMessages = new Map()

/**
 * @template T
 * @param {T[]} inputArray
 * @param {number} perChunk
 * @returns T[][]
 */
export const chunks = (inputArray, perChunk) =>
    inputArray.reduce((all, one, i) => {
        const ch = Math.floor(i / perChunk)
        all[ch] = [].concat(all[ch] || [], one)
        return all
    }, [])

/**
 * @param {import("node-telegram-bot-api")} bot
 * @param {string} productTitle
 * @param {number} userId
 * @returns {Promise<number>}
 */
export const requestCategoryId = async (bot, productTitle, userId) => {
    const categories = await getAllCategories(userId)
    const buttons = categories.map(({ title }) => ({ text: title }))
    await bot.sendMessage(
        userId,
        `Укажите категорию для <b>${productTitle}</b>`,
        {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: chunks(buttons, 2),
                resize_keyboard: true,
            },
        }
    )
    const { text: category } = await getAnswer(userId)

    return (
        categories.find(({ title }) => category === title)?.id ??
        (await insertCategory(category, userId))
    )
}

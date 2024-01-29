import {
    getAllCategories,
    changeCategoryTitle,
    getCategoryById,
} from "../database/index.js"
import { RemoveButton, deleteMessagesFromId, lastMessages } from "./utils.js"
import { getAnswer } from "../bot/index.js"
import { first } from "../fp/index.js"
import { unknownCategory, writeNewTitleFor } from "../views/index.js"

/** @type {Map<number, {self: number, request: number}>} */
const categoriesMessages = new Map()

/** @param {number} userId */
const getCategoriesText = async (userId) => {
    const categories = await getAllCategories(userId)
    return categories.reduce(
        (text, { id, title }) =>
            text +
            [`<b>${title}</b>`, `Переименовать /rename_category${id}`].join(
                "\n"
            ) +
            "\n\n",
        "<u>Категории</u>\n\n"
    )
}

/**
 * @param {import("node-telegram-bot-api")} bot
 * @param {number} userId
 * @param {number} [lastMessageId]
 */
export const applyCategoryChanges = async (bot, userId, lastMessageId) => {
    if (categoriesMessages.has(userId) === false) return
    const { self, request } = categoriesMessages.get(userId)

    bot.editMessageText(await getCategoriesText(userId), {
        chat_id: userId,
        message_id: self,
        parse_mode: "HTML",
        reply_markup: RemoveButton(request),
    }).catch(() => {})
    if (!lastMessageId) return
    deleteMessagesFromId(bot, userId, self + 1, lastMessageId)
}

/** @type {import("../bot/@types.ts").MessageHandler} */
export const categoriesCommand = async (message, bot) => {
    const chatId = message.chat.id
    const request = message.message_id
    const { message_id: self } = await bot.sendMessage(
        chatId,
        await getCategoriesText(chatId),
        {
            parse_mode: "HTML",
            reply_markup: RemoveButton(request),
        }
    )
    categoriesMessages.set(chatId, { self, request })
}

/**
 * @param {import("node-telegram-bot-api").Message} message
 * @param {import("node-telegram-bot-api")} bot
 */
export const renameCategory = async (message, bot) => {
    const {
        text = "",
        chat: { id: chatId },
    } = message
    if (!text.startsWith("/rename_category")) return false

    const id = first(text.slice("/rename_category".length).split("@"))
    const category = await getCategoryById(parseInt(id), chatId)
    if (!category) return bot.sendMessage(chatId, unknownCategory(id))
    await bot.sendMessage(chatId, writeNewTitleFor(category.title), {
        parse_mode: "HTML",
    })
    const { text: newTitle } = await getAnswer(chatId)
    changeCategoryTitle(category.id, newTitle.toLowerCase(), chatId)
    applyCategoryChanges(bot, chatId, lastMessages.get(chatId))
    return true
}

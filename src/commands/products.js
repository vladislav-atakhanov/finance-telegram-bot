import {
    changeProductCategory,
    getAllProducts,
    getProductById,
} from "../database/index.js"
import { first } from "../fp/index.js"
import { unknownProduct } from "../views/unknown.js"
import {
    RemoveButton,
    deleteMessagesFromId,
    lastMessages,
    requestCategoryId,
} from "./utils.js"

/** @type {Map<number, {self: number, request: number}>} */
const productMessages = new Map()

/** @param {number} userId */
const getProductsText = async (userId) => {
    const products = await getAllProducts(userId)
    return products.reduce(
        (text, { category, id, title }) =>
            text +
            [
                `<b>${title}</b>`,
                category,
                `Переименовать /rename${id}`,
                `Сменить категорию /change_category${id}`,
            ].join("\n") +
            "\n\n",
        "<u>Продукты</u>\n\n"
    )
}

/**
 * @param {import("node-telegram-bot-api")} bot
 * @param {number} userId
 * @param {number} [lastMessageId]
 */
export const applyProductChanges = async (bot, userId, lastMessageId) => {
    if (productMessages.has(userId) === false) return
    const { self, request } = productMessages.get(userId)
    bot.editMessageText(await getProductsText(userId), {
        chat_id: userId,
        message_id: self,
        parse_mode: "HTML",
        reply_markup: RemoveButton(request),
    }).catch(() => {})
    if (!lastMessageId) return
    deleteMessagesFromId(bot, userId, self + 1, lastMessageId)
}

/** @type {import("../bot/@types.ts").MessageHandler} */
export const productsCommand = async (message, bot) => {
    const chatId = message.chat.id
    const request = message.message_id
    const { message_id: self } = await bot.sendMessage(
        chatId,
        await getProductsText(chatId),
        {
            parse_mode: "HTML",
            reply_markup: RemoveButton(request),
        }
    )
    productMessages.set(chatId, { self, request })
}

/**
 * @param {import("node-telegram-bot-api").Message} message
 * @param {import("node-telegram-bot-api")} bot
 */
export const changeCategory = async (message, bot) => {
    const {
        text = "",
        chat: { id: chatId },
    } = message
    if (!text.startsWith("/change_category")) return false

    const id = first(text.slice("/change_category".length).split("@"))
    const product = await getProductById(parseInt(id), chatId)
    if (!product) return bot.sendMessage(chatId, unknownProduct(id))
    const categoryId = await requestCategoryId(bot, product.title, chatId)
    changeProductCategory(product.id, categoryId, chatId)
    applyProductChanges(bot, chatId, lastMessages.get(chatId))
    return true
}

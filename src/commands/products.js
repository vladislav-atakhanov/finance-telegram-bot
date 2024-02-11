import { PageKeyboard, getCurrentPage, setCurrentPage } from "../bot/index.js"
import {
    changeProductCategory,
    getAllProducts,
    getProductById,
} from "../database/index.js"
import { first } from "../fp/index.js"
import { productCard } from "../views/index.js"
import { unknownProduct } from "../views/unknown.js"
import {
    deleteMessagesFromId,
    lastMessages,
    requestCategoryId,
} from "./utils.js"

/** @type {Map<number, number>} */
const productMessages = new Map()

const CALLBACK_PREFIX = "products"

/**
 * @param {number} userId
 * @param {number} pageIndex
 */
const getProductsText = async (userId, pageIndex) => {
    const atPage = 4
    const products = await getAllProducts(userId)

    const startIndex = pageIndex * atPage
    const endIndex = Math.min(startIndex + atPage, products.length)

    let text = `<u>Продукты</u>\n\n`
    for (let index = startIndex; index < endIndex; index++)
        text += productCard(products[index])

    return { text, total: Math.ceil(products.length / atPage) }
}

/**
 * @param {import("node-telegram-bot-api")} bot
 * @param {number} userId
 * @param {number} [lastMessageId]
 */
export const applyProductChanges = async (bot, userId, lastMessageId) => {
    if (productMessages.has(userId) === false) return
    const message_id = productMessages.get(userId)
    const currentPage = getCurrentPage(message_id, userId)
    const { text, total } = await getProductsText(userId, currentPage)
    bot.editMessageText(text, {
        chat_id: userId,
        message_id: message_id,
        parse_mode: "HTML",
        reply_markup: PageKeyboard(currentPage, total, CALLBACK_PREFIX),
    }).catch(() => {})
    if (!lastMessageId) return
    deleteMessagesFromId(bot, userId, message_id + 1, lastMessageId)
}

/** @type {import("../bot/@types.ts").MessageHandler} */
export const productsCommand = async (message, bot) => {
    const chatId = message.chat.id
    const currentPage = 0
    const { text, total } = await getProductsText(chatId, currentPage)
    const { message_id } = await bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_markup: PageKeyboard(currentPage, total, CALLBACK_PREFIX),
    })
    setCurrentPage(message_id, chatId, currentPage)
    productMessages.set(chatId, message_id)
}

/**
 *
 * @param {import("node-telegram-bot-api")} bot
 * @param {import("node-telegram-bot-api").Message} message
 * @param {number} currentPage
 */
export const changeProductsPage = async (bot, message, currentPage) => {
    const userId = message.chat.id
    const messageId = message.message_id
    setCurrentPage(messageId, userId, currentPage)

    const { text, total } = await getProductsText(userId, currentPage)
    bot.editMessageText(text, {
        chat_id: userId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: PageKeyboard(currentPage, total, CALLBACK_PREFIX),
    }).catch(() => {})
}

/**
 * @param {import("node-telegram-bot-api").Message} message
 * @param {import("node-telegram-bot-api")} bot
 */
export const changeCategory = async (message, bot) => {
    const chatId = message.chat.id
    if (!message.text.startsWith("/change_category")) return false
    const id = first(message.text.slice("/change_category".length).split("@"))
    const product = await getProductById(parseInt(id), chatId)
    if (!product) return bot.sendMessage(chatId, unknownProduct(id))
    const categoryId = await requestCategoryId(bot, product.title, chatId)
    changeProductCategory(product.id, categoryId, chatId)
    applyProductChanges(bot, chatId, lastMessages.get(chatId))
    return true
}

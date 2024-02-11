import { getAnswer } from "../bot/index.js"
import { changeProductTitle, getProductById } from "../database/index.js"
import { first } from "../fp/index.js"
import { unknownProduct, writeNewTitleFor } from "../views/index.js"
import { applyProductChanges } from "./products.js"
import { lastMessages } from "./utils.js"

/**
 * @param {import("node-telegram-bot-api").Message} message
 * @param {import("node-telegram-bot-api")} bot
 */
export const rename = async (message, bot) => {
    const chatId = message.chat.id
    if (!message.text.startsWith("/rename")) return false

    const id = first(message.text.slice("/rename".length).split("@"))
    const product = await getProductById(parseInt(id), chatId)
    if (!product) return bot.sendMessage(chatId, unknownProduct(id))
    const { message_id } = await bot.sendMessage(
        chatId,
        writeNewTitleFor(product.title),
        { parse_mode: "HTML" }
    )
    const { text: newTitle, message_id: answerMessageId } = await getAnswer(
        chatId
    )
    bot.deleteMessage(chatId, message_id)
    bot.deleteMessage(chatId, answerMessageId)
    bot.deleteMessage(chatId, message.message_id)
    changeProductTitle(product.id, newTitle, chatId)
    applyProductChanges(bot, chatId, lastMessages.get(chatId))
    return true
}

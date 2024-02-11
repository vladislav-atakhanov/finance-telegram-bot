import { getAnswer } from "../bot/index.js"
import { addAlias, getProductById } from "../database/index.js"
import { first } from "../fp/index.js"
import { unknownProduct } from "../views/index.js"
/**
 * @param {import("node-telegram-bot-api").Message} message
 * @param {import("node-telegram-bot-api")} bot
 */
export const alias = async (message, bot) => {
    const chatId = message.chat.id
    if (!message.text.startsWith("/alias")) return false

    const id = first(message.text.slice("/alias".length).split("@"))
    const product = await getProductById(parseInt(id), chatId)
    if (!product) return bot.sendMessage(chatId, unknownProduct(id))
    const { message_id } = await bot.sendMessage(
        chatId,
        `Введите псевдоним для <b>${product.title}</b>`,
        { parse_mode: "HTML" }
    )
    const { text: alias, message_id: answerMessageId } = await getAnswer(chatId)
    bot.deleteMessage(chatId, message_id)
    bot.deleteMessage(chatId, answerMessageId)
    bot.deleteMessage(chatId, message.message_id)
    addAlias(product.id, alias, chatId)
    return true
}

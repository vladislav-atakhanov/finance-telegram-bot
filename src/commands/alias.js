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
    await bot.sendMessage(
        chatId,
        `Введите псевдоним для <b>${product.title}</b>`,
        { parse_mode: "HTML" }
    )
    const { text: alias } = await getAnswer(chatId)
    addAlias(product.id, alias, chatId)
    return true
}

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
    const {
        text = "",
        chat: { id: chatId },
    } = message
    if (!text.startsWith("/rename")) return false

    const id = first(text.slice("/rename".length).split("@"))
    const product = await getProductById(parseInt(id), chatId)
    if (!product) return bot.sendMessage(chatId, unknownProduct(id))
    await bot.sendMessage(chatId, writeNewTitleFor(product.title), {
        parse_mode: "HTML",
    })
    const { text: newTitle } = await getAnswer(chatId)
    changeProductTitle(product.id, newTitle.toLowerCase(), chatId)
    applyProductChanges(bot, chatId, lastMessages.get(chatId))
    return true
}

import { getMonthExpensesByCategories } from "../database/index.js"
import { formatPrice } from "../finance/utils.js"
import { RemoveButton } from "./utils.js"

/** @type {import("../bot/@types.ts").MessageHandler} */
export const byCategoryCommand = async (message, bot) => {
    const expenses = await getMonthExpensesByCategories(message.chat.id)

    let sum = 0
    const text = expenses.reduce((text, { category, value }) => {
        text += `${category} ${formatPrice(value)}\n`
        sum += value
        return text
    }, "<b>Траты за последний месяц</b>\n")
    bot.sendMessage(
        message.chat.id,
        `${text}Итого: <u>${formatPrice(sum)}</u>`,
        { parse_mode: "HTML", reply_markup: RemoveButton(message.message_id) }
    )
}

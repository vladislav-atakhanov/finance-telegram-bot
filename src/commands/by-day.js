import { getMonthExpensesByDay } from "../database/index.js"
import { formatDate, formatPrice } from "../finance/utils.js"
import { RemoveButton } from "./utils.js"

/** @type {import("../bot/@types.ts").MessageHandler} */
export const byDayCommand = async (message, bot) => {
    const expenses = await getMonthExpensesByDay(message.chat.id)

    let sum = 0
    const text = expenses.reduce((text, { date, value }) => {
        const _date = formatDate(new Date(date * 1000))
        const _value = formatPrice(value)
        text += `${_date} - ${_value}\n`
        sum += value
        return text
    }, "<b>Траты за последний месяц</b>\n")
    bot.sendMessage(
        message.chat.id,
        `${text}Итого: <u>${formatPrice(sum)}</u>`,
        { parse_mode: "HTML", reply_markup: RemoveButton(message.message_id) }
    )
}

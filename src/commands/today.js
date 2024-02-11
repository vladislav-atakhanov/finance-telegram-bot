import { getDayExpenses } from "../database/index.js"
import { RemoveKeyboard, compareStrings } from "./utils.js"

/**
 * @template {Record<string, unknown>} T
 * @param {T[]} array
 * @param {keyof T | ((item: T) => unknown)} key
 */
const groupBy = (array, key) => {
    /** @type {Map<unknown, T[]>} */
    const result = new Map()
    for (const item of array) {
        const value = typeof key !== "function" ? item[key] : key(item)
        if (result.has(value) === false) {
            result.set(value, [item])
            continue
        }
        result.get(value).push(item)
    }
    return result.values()
}

/**
 *
 * @param {Awaited<ReturnType<getDayExpenses>>} expenses
 */
const ExpensesCard = (expenses) => {
    if (expenses.length === 1) {
        const { price, meta, title } = expenses[0]
        if (compareStrings(title, meta))
            return {
                text: "",
                sum: price,
            }
    }
    let text = ""
    let sum = 0
    for (const { price, title } of expenses) {
        text += `${title} - ${price}\n`
        sum += price
    }
    return { text, sum }
}

/**
 *
 * @param {number} userId
 * @param {Date} date
 * @returns {Promise<string>}
 */
const getExpensesByDay = async (userId, date) => {
    const expenses = await getDayExpenses(userId, date)
    let messageText = ""
    let totalSum = 0

    for (const group of groupBy(expenses, "meta")) {
        if (group.length < 1) continue
        const meta = group[0].meta || "&lt;не указано&gt;"
        const { text, sum } = ExpensesCard(group)
        messageText += `<b>${meta} - ${sum}</b>\n${text}\n`
        totalSum += sum
    }
    return messageText + `Итого: <u>${totalSum}</u>`
}

/** @type {import("../bot/@types.ts").MessageHandler} */
export const todayCommand = async (message, bot) => {
    const messageText = await getExpensesByDay(message.chat.id, new Date())
    bot.sendMessage(
        message.chat.id,
        "<u>Траты за сегодня</u>\n\n" + messageText,
        {
            reply_markup: RemoveKeyboard(message.message_id),
            parse_mode: "HTML",
        }
    )
}

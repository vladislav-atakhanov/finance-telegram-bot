import {
    getMonthExpensesByCategories,
    getMonthExpensesByDay,
} from "../database/index.js"
import { formatPrice, formatDate } from "../finance/utils.js"

/** @param {number} userId */
export const byCategoryText = async (userId) => {
    const expenses = await getMonthExpensesByCategories(userId)

    let sum = 0
    const text = expenses.reduce((text, { category, value }) => {
        text += `${category} ${formatPrice(value)}\n`
        sum += value
        return text
    }, "<b>Траты за последний месяц</b>\n\n")
    return text + `\nИтого: <u>${formatPrice(sum)}</u>`
}

/** @param {number} userId */
export const byDayText = async (userId) => {
    const expenses = await getMonthExpensesByDay(userId)

    let sum = 0
    const text = expenses.reduce((text, { date, value }) => {
        const _date = formatDate(new Date(date * 1000))
        const _value = formatPrice(value)
        text += `${_date} - ${_value}\n`
        sum += value
        return text
    }, "<b>Траты за последний месяц</b>\n\n")

    return text + `\nИтого: <u>${formatPrice(sum)}</u>`
}

const Views = {
    day: {
        text: byDayText,
        keyboard: {
            inline_keyboard: [
                [
                    {
                        text: "По категориям",
                        callback_data: `month:category`,
                    },
                ],
            ],
        },
    },
    category: {
        text: byCategoryText,
        keyboard: {
            inline_keyboard: [
                [
                    {
                        text: "По дням",
                        callback_data: `month:day`,
                    },
                ],
            ],
        },
    },
}

/** @type {import("../bot/@types.ts").MessageHandler} */
export const monthCommand = async (message, bot) => {
    const chatId = message.chat.id

    const { text, keyboard } = Views["day"]
    bot.sendMessage(chatId, await text(chatId), {
        parse_mode: "HTML",
        reply_markup: keyboard,
    })
}

/**
 * @param {import("node-telegram-bot-api")} bot
 * @param {import("node-telegram-bot-api").Message} message
 * @param {string} view
 */
export const setMonthView = async (bot, message, view) => {
    if (view in Views === false) return
    const { text, keyboard } = Views[view]

    const chatId = message.chat.id
    bot.editMessageText(await text(chatId), {
        chat_id: chatId,
        message_id: message.message_id,
        parse_mode: "HTML",
        reply_markup: keyboard,
    })
}

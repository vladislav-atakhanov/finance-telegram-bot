import { getDayExpensesSum } from "../database/index.js"

/** @type {import("../bot/@types.ts").MessageHandler} */
export const todayCommand = async (message, bot) => {
    const todaySum = await getDayExpensesSum(message.chat.id, new Date())
    bot.sendMessage(message.chat.id, `Траты за сегодня: ${todaySum}`)
}

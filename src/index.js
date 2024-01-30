import TelegramBot from "node-telegram-bot-api"
import {
    insertMeta,
    insertExpense,
    getProduct,
    insertProduct,
    getDayExpensesSum,
} from "./database/index.js"
import { CommandRouter, checkAnswer } from "./bot/index.js"
import { parseMessage } from "./finance/index.js"
import { formatDate, formatPrice } from "./finance/utils.js"
import * as c from "./commands/index.js"
import { expensesHelp } from "./views/index.js"
import { lastMessages, requestCategoryId } from "./commands/utils.js"

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const commandRouter = CommandRouter(bot)
commandRouter.add("/today", "Траты за сегодня", c.todayCommand)
commandRouter.add("/month", "Траты за последний месяц", c.monthCommand)
commandRouter.add("/products", "Продукты и их категории", c.productsCommand)
commandRouter.add("/categories", "Все категории", c.categoriesCommand)
commandRouter.add("/help", "Помощь", c.helpCommand)
commandRouter.add("/start", "Приветственное сообщение", c.startCommand)
commandRouter.add("/group", "Как добавить бота в группу", c.groupCommand)
await commandRouter.apply()

/**
 * @param {string} title
 * @param {number} userId
 */
const getProductId = async (title, userId) => {
    const product = await getProduct(title, userId)
    if (product) return product.id

    const categoryId = await requestCategoryId(bot, title, userId)
    return insertProduct(title, categoryId, userId)
}

/**
 *
 * @param {import("./finance/@types.ts").Expenses} expenses
 * @param {number} userId
 */
const addExpenses = async ({ meta, items }, userId) => {
    const metaId = await insertMeta(meta, userId)
    let sum = 0
    for (const { amount, price, product } of items) {
        const productId = await getProductId(product, userId)
        await insertExpense(amount, price, productId, metaId)
        sum += price
    }
    const todaySum = await getDayExpensesSum(userId, new Date())

    const day = formatDate(meta.date)
    const sum_ = formatPrice(sum)
    const todaySum_ = formatPrice(todaySum)
    await bot.sendMessage(
        userId,
        `Итого ${day} - ${sum_}\nЗа сегодня - ${todaySum_}`,
        { reply_markup: { remove_keyboard: true } }
    )
}

bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id
    if (query.data.startsWith("remove")) {
        bot.deleteMessage(chatId, query.message.message_id)
        const messageId = parseInt(query.data.slice("remove".length))
        if (messageId) bot.deleteMessage(chatId, messageId)
        return
    }
    const [command, ...args] = query.data.split(":")

    if (command === "products")
        return c.changeProductsPage(bot, query.message, parseInt(args[0]))
    if (command === "month") return c.setMonthView(bot, query.message, args[0])
})

bot.on("message", async (message) => {
    lastMessages.set(message.chat.id, message.message_id)
    if (!message.text) return checkAnswer(message)
    if (await commandRouter.answer(message)) return
    if (await c.renameCategory(message, bot)) return
    if (await c.changeCategory(message, bot)) return
    if (await c.rename(message, bot)) return
    if (checkAnswer(message)) return

    const userId = message.chat.id
    const expenses = parseMessage(message.text)
    if (expenses.items.length > 0) return addExpenses(expenses, userId)
    bot.sendMessage(userId, expensesHelp(), { parse_mode: "HTML" })
})

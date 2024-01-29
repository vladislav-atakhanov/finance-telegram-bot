import TelegramBot from "node-telegram-bot-api"
import {
    insertMeta,
    insertExpense,
    getProduct,
    insertProduct,
    getDayExpensesSum,
} from "./database/index.js"
import { CommandRouter, checkAnswer, getAnswer } from "./bot/index.js"
import { parseMessage } from "./finance/index.js"
import { formatDate, formatPrice } from "./finance/utils.js"
import {
    productsCommand,
    byDayCommand,
    todayCommand,
    byCategoryCommand,
    categoriesCommand,
    renameCategory,
    changeCategory,
    rename,
} from "./commands/index.js"
import { expensesHelp } from "./views/index.js"
import { lastMessages, requestCategoryId } from "./commands/utils.js"

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const commandRouter = CommandRouter(bot)
commandRouter.add("/help", "Помощь", "Введите траты за сегодня")
commandRouter.add("/today", "Траты за сегодня", todayCommand)
commandRouter.add("/products", "Продукты и их категории", productsCommand)
commandRouter.add("/categories", "Все категории", categoriesCommand)
commandRouter.add("/by_day", "Траты за последний месяц по дням", byDayCommand)
commandRouter.add(
    "/by_category",
    "Траты за последний месяц по категориям",
    byCategoryCommand
)
await commandRouter.apply()

/**
 * @param {string} title
 * @param {number} userId
 */
const getProductId = async (title, userId) => {
    title = title.toLowerCase()
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
        `Итого ${day} ${sum_}\nЗа сегодня ${todaySum_}`,
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
})

bot.on("message", async (message) => {
    lastMessages.set(message.chat.id, message.message_id)
    if (checkAnswer(message)) return
    if (!message.text) return
    if (await commandRouter.answer(message)) return
    if (await renameCategory(message, bot)) return
    if (await changeCategory(message, bot)) return
    if (await rename(message, bot)) return

    const {
        text,
        chat: { id },
    } = message

    const expenses = parseMessage(text)
    if (expenses.items.length > 0) return addExpenses(expenses, id)
    bot.sendMessage(id, expensesHelp(), { parse_mode: "HTML" })
})

import { first, last } from "../fp/index.js"

/**
 * @param {string} text
 * @returns {import("./@types.ts").Currency}
 */
const parsePrice = (text) => parseFloat(text)

/**
 * @param {string} text
 * @returns {boolean}
 */
const isNumber = (text) => !isNaN(parseFloat(text))

/**
 * @param {string[]} words
 * @returns {import("./@types.ts").ExpenseMeta}
 */
const parseMeta = (words) => {
    let date = new Date()

    if (isNumber(first(words))) {
        const [day, month] = words[0].split(".").map(Number)
        date.setMonth(month - 1)
        date.setDate(day)
        words = words.slice(1)
    }

    return { title: words.join(" "), date }
}

/**
 * @param {string[]} words
 * @returns {import("./@types.ts").Expense}
 */
const parseExpense = (words) => {
    let amount = 1
    let price = parsePrice(words.pop())
    let product = words

    if (isNumber(first(words))) amount = parseFloat(words.shift())
    return { amount, product: product.join(" "), price }
}

/**
 * @param {string} message
 * @returns {import("./@types.ts").Expenses}
 */
export const parseMessage = (message) => {
    /** @type {import("./@types.ts").Expenses} */
    const expenses = message.split("\n").reduce(
        (expenses, line) => {
            const words = line.trim().split(" ")
            if (words.length === 1) {
                expenses.meta = parseMeta(words)
                return expenses
            }
            if (isNumber(last(words))) {
                const expense = parseExpense(words)
                expenses.items.push(expense)
            } else {
                expenses.meta = parseMeta(words)
            }
            return expenses
        },
        { meta: { date: new Date() }, items: [] }
    )
    if (!expenses.meta.title && expenses.items.length === 1)
        expenses.meta.title = expenses.items[0].product
    return expenses
}

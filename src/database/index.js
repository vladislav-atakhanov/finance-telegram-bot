import { database, sql, Timestamp } from "./core.js"
export * from "./product.js"
export * from "./category.js"

/**
 * @param {import("../finance/@types.ts").ExpenseMeta} meta
 * @param {number} userId
 */
export const insertMeta = async ({ title, date }, userId) => {
    const { lastID } = await database.run(
        `INSERT INTO Meta (title, date_, user_id) VALUES (?, ?, ?)`,
        title,
        Timestamp(date),
        userId
    )
    return lastID
}

/**
 * @param {number} userId
 * @param {Date} date
 */
export const getDayExpensesSum = async (userId, date) => {
    const { value } = await database.get(
        sql("day-expenses-sum"),
        userId,
        Timestamp(date)
    )
    return value ?? 0
}

/**
 * @param {number} userId
 * @param {Date} date
 * @returns {Promise<{meta: string, title: string, price: number}[]>}
 */
export const getDayExpenses = (userId, date) =>
    database.all(sql("day-expenses"), userId, Timestamp(date))

/**
 * @param {number} userId
 * @returns {Promise<{date: number, value: number}[]>}
 */
export const getMonthExpensesByDay = (userId) =>
    database.all(sql("month-expenses-by-day"), userId)

/**
 *
 * @param {number} amount
 * @param {number} price
 * @param {number} productId
 * @param {number} metaId
 */
export const insertExpense = async (amount, price, productId, metaId) => {
    await database.run(
        `INSERT INTO Expense (amount, price, product_id, meta_id) VALUES (?, ?, ?, ?)`,
        amount,
        price,
        productId,
        metaId
    )
}

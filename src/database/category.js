import { database, sql } from "./core.js"

/**
 * @param {string} title
 * @param {number} userId
 */
export const insertCategory = async (title, userId) => {
    const { lastID } = await database.run(
        `insert into Category (title, user_id) VALUES (?, ?)`,
        title,
        userId
    )
    return lastID
}

/**
 * @param {number} userId
 * @returns {Promise<import("./@types.ts").Category[]>}
 */
export const getAllCategories = (userId) =>
    database.all("SELECT * FROM Category WHERE user_id=?", userId)

/**
 * @param {number} userId
 * @returns {Promise<{category: string, value: number}[]>}
 */
export const getMonthExpensesByCategories = (userId) =>
    database.all(sql("month-expenses-by-categories"), userId)

/**
 * @param {number} categoryId
 * @param {number} userId
 * @returns {Promise<import("./@types.ts").Category>}
 */
export const getCategoryById = (categoryId, userId) =>
    database.get(
        `SELECT * FROM Category WHERE id=? AND user_id=?`,
        categoryId,
        userId
    )

/**
 *
 * @param {number} categoryId
 * @param {string} newTitle
 * @param {number} userId
 */
export const changeCategoryTitle = (categoryId, newTitle, userId) =>
    database.run(
        `UPDATE Category SET title=? WHERE id=? AND user_id=?`,
        newTitle,
        categoryId,
        userId
    )

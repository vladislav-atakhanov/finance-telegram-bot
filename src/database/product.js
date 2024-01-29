import { database, sql } from "./core.js"

/**
 * @param {string} title
 * @param {number} categoryId
 * @param {number} userId
 */
export const insertProduct = async (title, categoryId, userId) => {
    const { lastID } = await database.run(
        `insert into Product (title, category_id, user_id) VALUES (?, ?, ?)`,
        title,
        categoryId,
        userId
    )
    return lastID
}

/**
 *
 * @param {string} title
 * @param {number} userId
 * @return {Promise<import("./@types.ts").Product>}
 */
export const getProduct = async (title, userId) => {
    return await database.get(
        `SELECT * FROM Product WHERE title=? AND user_id=?`,
        title,
        userId
    )
}

/**
 *
 * @param {number} id
 * @param {number} userId
 * @return {Promise<import("./@types.ts").Product>}
 */
export const getProductById = async (id, userId) => {
    return await database.get(
        `SELECT * FROM Product WHERE id=? AND user_id=?`,
        id,
        userId
    )
}

/**
 *
 * @param {number} productId
 * @param {number} categoryId
 * @param {number} userId
 */
export const changeProductCategory = (productId, categoryId, userId) =>
    database.run(
        `UPDATE Product SET category_id=? WHERE id=? AND user_id=?`,
        categoryId,
        productId,
        userId
    )

/**
 *
 * @param {number} productId
 * @param {number} userId
 * @param {string} newTitle
 */
export const changeProductTitle = (productId, newTitle, userId) =>
    database.run(
        `UPDATE Product SET title=? WHERE id=? AND user_id=?`,
        newTitle,
        productId,
        userId
    )

/**
 * @param {number} userId
 * @returns {Promise<{
 *   id: number,
 *   title: string,
 *   category: string
 * }[]>}
 */
export const getAllProducts = async (userId) =>
    database.all(sql("all-products"), userId)

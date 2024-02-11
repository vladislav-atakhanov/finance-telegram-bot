import { database, sql } from "./core.js"

/**
 * @param {string} title
 * @param {number} categoryId
 * @param {number} userId
 */
export const insertProduct = async (title, categoryId, userId) => {
    const { lastID } = await database.run(
        `insert into Product (title, category_id, user_id) VALUES (?, ?, ?, ?)`,
        title,
        categoryId,
        userId
    )
    addAlias(lastID, title, userId)
    return lastID
}

/**
 *
 * @param {number} productId
 * @param {string} alias
 * @param {number} userId
 */
export const addAlias = async (productId, alias, userId) => {
    alias = alias.toLowerCase()

    database.run(
        `INSERT INTO Alias (alias, product_id) VALUES (?, ?)`,
        alias,
        productId
    )

    const products = await getAllProducts(userId)
    products.forEach(({ id, title }) => {
        if (title.toLowerCase() !== alias) return
        database.run(
            `UPDATE Expense SET product_id=? WHERE product_id=?`,
            productId,
            id
        )
        database.run(
            `UPDATE Alias SET product_id=? WHERE product_id=?`,
            productId,
            id
        )
        database.run(`DELETE FROM Product WHERE id=? AND user_id=?`, id, userId)
    })
}

/**
 *
 * @param {string} title
 * @param {number} userId
 * @return {Promise<import("./@types.ts").Product>}
 */
export const getProduct = async (title, userId) =>
    database.get(
        `SELECT * FROM Product WHERE user_id=? AND id=(SELECT product_id from Alias WHERE alias=?)`,
        userId,
        title.toLowerCase()
    )

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

import { Database } from "sqlite-async"

import { join, dirname } from "node:path"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

/** @param {string} path */
const readFile = (path) => readFileSync(path, { encoding: "utf-8" })

/**
 * @param {string} path
 * @param {string} [initialScript]
 * @returns {Promise<import("./@types.ts").Database>}
 */
export const connect = async (path, initialScript = "") => {
    const db = await Database.open(path)
    if (initialScript.length > 0) db.exec(initialScript)
    return db
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = dirname(__dirname)

export const database = await connect(
    join(dirname(root), "finance.db"),
    readFile(join(root, "init.sql"))
)

/** @param {Date} date */
export const Timestamp = (date) => Math.floor(date.getTime() / 1000)

/** @type {Map<string, string>} */
const sqlScripts = new Map()

/** @param {string} filename */
export const sql = (filename) => {
    if (sqlScripts.has(filename)) return sqlScripts.get(filename)
    const script = readFile(join(__dirname, "sql", `${filename}.sql`))
    sqlScripts.set(filename, script)
    return script
}

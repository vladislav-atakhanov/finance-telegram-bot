import type { Database as DB } from "sqlite3"

interface Patches {
    run: (
        sql: string,
        ...params: any[]
    ) => Promise<{ lastID: number; changes: number }>
    get: <T>(sql: string, ...params: any[]) => Promise<T | null>
    all: <T>(sql: string, ...params: any[]) => Promise<T[]>
}

export type Database = Omit<DB, keyof Patches> & Patches

export interface Product {
    id: number
    title: string
    category_id: number
    user_id: number
}

export interface Category {
    id: number
    title: string
    user_id: number
}

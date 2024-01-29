type KZT = number
export type Currency = KZT

export interface Expense {
    amount: number
    product: string
    price: Currency
}

export interface ExpenseMeta {
    title?: string
    date: Date
}

export interface Expenses {
    meta: ExpenseMeta
    items: Expense[]
}

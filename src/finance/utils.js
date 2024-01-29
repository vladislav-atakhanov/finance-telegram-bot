const locale = "ru-RU"

const DateFormatter = Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
})
const NumberFormatter = Intl.NumberFormat(locale)

/** @param {Date} date */
export const formatDate = (date) => DateFormatter.format(date)

/** @param {number} value */
export const formatNumber = (value) => NumberFormatter.format(value)

/** @param {number} value */
export const formatPrice = (value) => NumberFormatter.format(Math.ceil(value))

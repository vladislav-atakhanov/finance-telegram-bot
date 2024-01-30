export { todayCommand } from "./today.js"
export { rename } from "./rename.js"
export { groupCommand } from "./group.js"
export * from "./month.js"
export * from "./products.js"
export * from "./categories.js"

import { html } from "./utils.js"

export const helpCommand = "Введите траты за сегодня"
export const startCommand = html(`Привет!<br>

<br>Это телеграм-бот для учета расходов. Я могу вести отчёт о всех твоих покупках,
присваивать им категории, выдавать отчёт о тратах по дням и категориям<br>

<br>Меня можно добавить в группу, чтобы вести общий бюджет. Инструкция /group<br>

<br><b>Команды бота</b>
<br>/start — приветственное сообщение
<br>/help — помощь
<br>/today — траты за сегодня
<br>/month — траты за последний месяц
<br>/products — все продукты и их категории
<br>/categories — все категории
<br>/group — как добавить бота в группу`)

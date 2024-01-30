export * from "./unknown.js"
export { writeNewTitleFor } from "./write-new-title-for.js"
export const expensesHelp = () => `Формат сообщения с тратами:
<blockquote>[дата] место
продукт &lt;стоимость&gt;
[количество] продукт &lt;стоимость&gt;</blockquote>`

export const productCard = ({ category, id, title }) => `<b>${title}</b>
${category}
/rename${id} - переименовать
/change_category${id} - сменить категорию\n\n`

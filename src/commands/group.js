import { html } from "./utils.js"

const text = html(`
Убедитесь что бот имеет доступ к сообщениям группы<br>

<br>Чтобы выдать доступ, назначьте бота администратором группы, дайте
разрешение на удаление сообщений. Остальные разрешения можно забрать`)

/** @type {import("../bot/@types.ts").MessageHandler} */
export const groupCommand = async (message, bot) => {
    bot.sendMessage(message.chat.id, text)
}

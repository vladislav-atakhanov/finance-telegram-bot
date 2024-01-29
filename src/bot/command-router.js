/**
 * @param {import("node-telegram-bot-api")} bot
 * @returns {import("./@types.ts").CommandRouter}
 */
export const CommandRouter = (bot) => {
    /** @type {Map<string, import("./@types.ts").Command>} */
    const commands = new Map()

    return {
        async answer(message) {
            if (!message.text) return false
            const command = message.text.split(" ")[0].split("@")[0]
            if (commands.has(command) === false) return false
            const { handler } = commands.get(command)
            await handler(message, bot)
            return true
        },
        async apply() {
            await bot.setMyCommands(
                Array.from(commands.values()).map(
                    ({ command, description }) => ({
                        command,
                        description,
                    })
                )
            )
        },
        add(command, description, handlerOrMessage) {
            commands.set(command, {
                command,
                description,
                handler:
                    typeof handlerOrMessage !== "string"
                        ? handlerOrMessage
                        : async (message) => {
                              await bot.sendMessage(
                                  message.chat.id,
                                  handlerOrMessage
                              )
                          },
            })
        },
    }
}

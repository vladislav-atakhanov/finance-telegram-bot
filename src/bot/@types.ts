import type TelegramBot from "node-telegram-bot-api"

export type Message = TelegramBot.Message

export type MessageHandler = (
    message: Message,
    bot: TelegramBot
) => Promise<any>

export interface Command {
    command: string
    description: string
    handler: MessageHandler
}

export interface CommandRouter {
    apply: () => Promise<void>
    add: (
        command: string,
        description: string,
        handler: MessageHandler | string
    ) => void
    answer: (message: TelegramBot.Message) => Promise<boolean>
}

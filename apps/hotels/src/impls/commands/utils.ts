import { textCommands } from './constants';
import { Command } from './types';
import { KeyboardButton, Message } from 'node-telegram-bot-api';
import { bot } from '../../main';

export const isTextCommand = (text: string): text is Command =>
  Object.values(textCommands).includes(text);

export const getTextCommand = (text: string): Command =>
  Object.keys(textCommands).find(
    (key) => textCommands[key as Command] === text
  ) as Command;

export const setKeyboard = async (
  keyboard: KeyboardButton[][],
  message: Message
) => {
  const chatId = message.chat.id;
  await bot.sendMessage(
    chatId,
    '',
    /*replies.chooseAction,*/ {
      reply_markup: {
        keyboard,
        remove_keyboard: true,
        one_time_keyboard: false,
        is_persistent: false,
        resize_keyboard: true,
      },
    }
  );
};
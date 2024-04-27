import { Command, Step } from './types';
import { Message } from 'node-telegram-bot-api';
import { bot } from '../../main';

export const descriptions = {
  [Command.Start]: 'Запустить бота',
  // [Command.Check]: 'Проверить состояние сервера',
  // [Command.Subscribe]: 'Подписаться на уведомления',
  // [Command.Unsubscribe]: 'Отписаться от уведомлений',
  // [Command.Notifications]: 'Уведомления',
  // [Command.MainMenu]: 'Главное меню',
  // [Command.ServerMenu]: 'Серверное меню',
  // [Command.ReloadServer]: 'Перезагрузить сервер',
  // [Command.AdminPanel]: 'Админ панель',
  // [Command.ShowAccessKeys]: 'Ключи доступа',
  // [Command.ShowUsers]: 'Пользователи',
  // [Command.GenerateAccessKey]: 'Сгенерировать ключ доступа',
};

export const textCommands = {
  [Command.Start]: `🔄 ${descriptions[Command.Start]}`,
  // [Command.Check]: `💻 ${descriptions[Command.Check]}`,
  // [Command.Subscribe]: `📲 ${descriptions[Command.Subscribe]}`,
  // [Command.Unsubscribe]: `❌ ${descriptions[Command.Unsubscribe]}`,
  // [Command.Notifications]: `✉️ ${descriptions[Command.Notifications]}`,
  // [Command.MainMenu]: `Ⓜ️ ${descriptions[Command.MainMenu]}`,
  // [Command.ServerMenu]: `💻 ${descriptions[Command.ServerMenu]}`,
  // [Command.ReloadServer]: `🔄 ${descriptions[Command.ReloadServer]}`,
  // [Command.AdminPanel]: `🧑‍💻 ${descriptions[Command.AdminPanel]}`,
  // [Command.ShowAccessKeys]: `🔑 ${descriptions[Command.ShowAccessKeys]}`,
  // [Command.ShowUsers]: `👨 ${descriptions[Command.ShowUsers]}`,
  // [Command.GenerateAccessKey]: `🗝 ${descriptions[Command.GenerateAccessKey]}`,
};

export const steps = {};
export const users = {};

export const commands: {
  [key in Command | 'default']: (message: Message) => void;
} = {
  [Command.Start]: (message) => {
    const chatId = message.chat.id;

    steps[chatId] = Step.FirstTopic;

    void bot.sendMessage(chatId, replies.greeting());
  },
  // [Command.Check]: check,
  // [Command.Subscribe]: subscribe,
  // [Command.Unsubscribe]: unsubscribe,
  // [Command.Notifications]: notifications,
  // [Command.MainMenu]: mainMenu,
  // [Command.ServerMenu]: serverMenu,
  // [Command.AdminPanel]: adminPanel,
  // [Command.ShowAccessKeys]: showAccessKeys,
  // [Command.ShowUsers]: showUsers,
  // [Command.GenerateAccessKey]: generateAccessKey,
  // [Command.ReloadServer]: reloadServer
  default: (message) => {
    const chatId = message.chat.id;

    switch (steps[chatId]) {
      case Step.FirstTopic:
          users[chatId] = message.text;

          void bot.sendMessage(
          chatId,
          `Тема 1: Правила этикета при общении с инвалидами по зрению.
[Здесь видео]`,
          {
            reply_markup: {
              inline_keyboard: [[{ text: 'Готово', callback_data: '/done' }]],
              is_persistent: true,
              one_time_keyboard: true,
              selective: true,
            },
          }
        );

        break;
      // void bot.sendMessage(
      //   chatId,
      //   `Сейчас Вам необходимо пройти тест на знание правил этикета при общении с инвалидами по слуху. Пожалуйста, будьте внимательны.`
      // );
      //
      // void bot.sendMessage(
      //   chatId,
      //   `Как правильно приветствовать гостя с ограничением по зрению?`
      // );
    }
  },
};

export const replies = {
  greeting: () => {
    return `Здравствуйте.
Введите свои ФИО, должность. Например:

Васильев Иван Викторович, охранник`;
  },
};

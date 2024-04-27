import { createBot, mailer } from './bootstrap';
import { env } from 'process';
import { Message } from 'node-telegram-bot-api';
import {
  handleUnauthenticated,
  isAuthenticated,
  getTextCommand,
  isTextCommand,
  commands,
  steps,
  users,
} from './impls';
import { logger } from 'nx/src/utils/logger';
import { messages } from 'nx/src/utils/ab-testing';

export const bot = createBot(env['TELEGRAM_API_KEY'] as string);

process.on('exit', () => {
  // mongoose.disconnect();
  void bot.close();
});

bot.on('message', async (message: Message) => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return handleUnauthenticated();
  } else {
    return main(message);
  }
});

const main = async (message: Message) => {
  const { text } = message;
  if (isTextCommand(text as string)) {
    const endpoint = getTextCommand(text as string);
    return commands[endpoint](message);
  }

  const endpoint =
    commands[text as keyof typeof commands] ?? commands['default'];
  if (endpoint) {
    return endpoint(message);
  }
};

bot.on('callback_query', (query) => {
  if (query.data === '/done') {
    bot
      .sendMessage(
        query.message.chat.id,
        'Сейчас Вам необходимо пройти тест на знание правил этикета при общении с инвалидами по слуху. Пожалуйста, будьте внимательны.',
        {
          reply_markup: { remove_keyboard: true },
        }
      )
      .then(async () => {
        const message = await bot.sendPoll(
          query.message.chat.id,
          'Вопрос 1. Как правильно приветствовать гостя с ограничением по зрению?',
          [
            'Похлопать по плечу',
            'Окликнуть гостя',
            'Проигнорировать гостя, пока он сам не поздоровается',
          ]
        );

        const handle = (poll) => {
          const votedFor = poll.options.find(
            ({ voter_count }) => voter_count > 0
          ).text;

          mailer.sendMail({
            from: 'Telegram Hilton <ighosta9@gmail.com>',
            to: ['ighosta9@gmail.com', 'ne.yulyayulya@yandex.ru'],
            subject: `Результаты тестирования (${users[message.chat.id]})`,
            text: votedFor,
          });

          bot.sendMessage(message.chat.id, 'Тестирование завершено.')

          bot.off('poll', handle);
        };

        bot.on('poll', handle);
      });
  }
});

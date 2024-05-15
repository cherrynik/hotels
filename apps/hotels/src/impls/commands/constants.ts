import { Command, Step } from './types';
import { Message, Poll } from 'node-telegram-bot-api';
import { bot } from '../../main';
import { nextStep } from './utils';
import { set } from 'lodash';
import { mailer } from '../../bootstrap';

export const descriptions = {
  [Command.Start]: 'Запустить бота',
};

export const textCommands = {
  [Command.Start]: `🔄 ${descriptions[Command.Start]}`,
};

export const replies = {
  greeting: () => {
    return `Здравствуйте.
Введите свои ФИО, должность. Например:

Васильев Иван Викторович, охранник`;
  },
};

export const steps = {};
export const users = {};

export const commands: {
  [key in Command | 'default']: (message: Message) => void;
} = {
  [Command.Start]: (message) => {
    nextStep(message);

    void bot.sendMessage(message.chat.id, replies.greeting());
  },
  default: (message) => {
    handleSteps(message);
  },
};

const firstTopic = (message: Message) => {
  const chatId = message.chat.id;
  set(users, `${chatId}.fullName`, message.text);

  void bot.sendMessage(
    chatId,
    `Тема 1: Правила этикета при общении с инвалидами по зрению.
youtube.com/watch?v=StZcUAPRRac&ab_channel=RammsteinOfficial`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Готово',
              callback_data: `/done?step=${steps[chatId] + 1}`,
            },
          ],
        ],
        is_persistent: true,
        one_time_keyboard: true,
        selective: true,
      },
    }
  );
};

const firstTopicTest = (message: Message) => {
  const chatId = message.chat.id;
  bot
    .sendMessage(
      chatId,
      'Сейчас Вам необходимо пройти тест на знание правил этикета при общении с инвалидами по слуху. Пожалуйста, будьте внимательны.',
      {
        reply_markup: { remove_keyboard: true },
      }
    )
    .then(async () => {
      await bot.sendPoll(
        chatId,
        'Вопрос 1. Как правильно приветствовать гостя с ограничением по зрению?',
        [
          'Похлопать по плечу',
          'Окликнуть гостя',
          'Проигнорировать гостя, пока он сам не поздоровается',
        ]
      );

      const handle = (poll: Poll) => {
        const answer = poll.options.find(
          ({ voter_count }) => voter_count > 0
        ).text;

        set(users, `${chatId}.firstTopicTest`, answer);

        nextStep(message);
        commands['default'](message);

        bot.off('poll', handle);
      };

      bot.on('poll', handle);
    });
};

const secondTopic = (message: Message) => {
  const chatId = message.chat.id;
  set(users, `${chatId}.fullName`, message.text);

  void bot.sendMessage(
    chatId,
    `Тема 2: XYZ
[...]`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Готово',
              callback_data: `/done?step=${steps[chatId] + 1}`,
            },
          ],
        ],
        is_persistent: true,
        one_time_keyboard: true,
        selective: true,
      },
    }
  );
};

const secondTopicTest = (message: Message) => {
  const chatId = message.chat.id;
  bot
    .sendMessage(chatId, '2 test', {
      reply_markup: { remove_keyboard: true },
    })
    .then(async () => {
      await bot.sendPoll(chatId, 'Вопрос 2. XYZ?', ['1', '2', '3']);

      const handle = (poll: Poll) => {
        const answer = poll.options.find(
          ({ voter_count }) => voter_count > 0
        ).text;

        set(users, `${chatId}.firstTopicTest`, answer);

        nextStep(message);
        commands['default'](message);

        bot.off('poll', handle);
      };

      bot.on('poll', handle);
    });
};

const finish = (message: Message) => {
  const chatId = message.chat.id;
  set(users, `${chatId}.fullName`, message.text);

  void bot.sendMessage(chatId, `Thank you.`);
};

export const handleSteps = (message: Message) => {
  const chatId = message.chat.id;
  const step = steps[chatId];

  const handle = {
    [Step.FirstTopic]: firstTopic,
    [Step.FirstTopicTest]: firstTopicTest,
    [Step.SecondTopic]: secondTopic,
    [Step.SecondTopicTest]: secondTopicTest,
    [Step.Finish]: finish,
  }[step];

  handle?.(message);
};

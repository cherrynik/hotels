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
export const polls = {};

export const commands: {
  [key in Command | 'default']: (message: Message) => void;
} = {
  [Command.Start]: (message) => {
    const chatId = message.chat.id;
    steps[chatId] = Step.FirstTopic;
    if (users[chatId]?.activePoll) {
      users[chatId].activePoll = undefined;
    }

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
    `Тема 1: Правила этикета при общении с инвалидами по зрению и с инвалидами по слуху
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
        one_time_keyboard: true,
        selective: true,
      },
    }
  );
};

const firstTopicTest1 = (message: Message) => {
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
      const sentMessage = await bot.sendPoll(
        chatId,
        'Вопрос 1. Что делать, если гость с нарушением слуха попросил повторить ваше сообщение?',
        [
          'Повысить голос и повторить сообщение.',
          'Терпеливо и четко повторить сообщение, используя ясную артикуляцию.',
          'Использовать жесты вместо повторения.',
        ]
      );

      const pollId = sentMessage.poll.id;
      users[chatId].activePoll = pollId;
      polls[pollId] = message;
    });
};

const firstTopicTest2 = (message: Message) => {
  const chatId = message.chat.id;
  bot
    .sendPoll(
      chatId,
      'Вопрос 2. Какова лучшая практика при общении с гостем, который использует слуховой аппарат?',
      [
        'Говорить максимально громко.',
        'Говорить чётко, используя нормальный тон и скорость.',
        'Говорить медленно и переформулировать каждое предложение.',
      ]
    )
    .then((sentMessage) => {
      const pollId = sentMessage.poll.id;
      users[chatId].activePoll = pollId;
      polls[pollId] = message;
    });
};

const firstTopicTest3 = (message: Message) => {
  const chatId = message.chat.id;
  bot
    .sendPoll(chatId, 'Вопрос 3. Как предложить помощь слепому гостю?', [
      'Взять гостя за руку и вести его.',
      'Спросить, нужна ли помощь, и если да, то как именно вы можете помочь.',
      'Немедленно предоставить помощь, не спрашивая.',
    ])
    .then((sentMessage) => {
      const pollId = sentMessage.poll.id;
      users[chatId].activePoll = pollId;
      polls[pollId] = message;
    });
};

const secondTopic = (message: Message) => {
  const chatId = message.chat.id;
  set(users, `${chatId}.fullName`, message.text);

  void bot.sendMessage(
    chatId,
    `Тема 2: Правила этикета при общении с инвалидами-колясочниками
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

const secondTopicTest1 = (message: Message) => {
  const chatId = message.chat.id;
  void bot
    .sendPoll(
      chatId,
      'Вопрос 1. Что делать, если вы не уверены, как обратиться к гостю с физической инвалидностью?',
      [
        'Спросить у коллеги в присутствии гостя.',
        'Спросить у гостя напрямую, как ему будет комфортнее, чтобы к нему обращались.',
        'Просто использовать любые обращения.',
      ]
    )
    .then((sentMessage) => {
      const pollId = sentMessage.poll.id;
      users[chatId].activePoll = pollId;
      polls[pollId] = message;
    });
};

const secondTopicTest2 = (message: Message) => {
  const chatId = message.chat.id;
  void bot
    .sendPoll(
      chatId,
      'Вопрос 2. Как следует реагировать, когда гость на инвалидной коляске самостоятельно подъезжает к ресепшн?',
      [
        'Немедленно подойти и предложить помощь.',
        'Подождать, чтобы увидеть, запросит ли гость помощь.',
        'Игнорировать, пока он сам не начнет разговор.',
      ]
    )
    .then((sentMessage) => {
      const pollId = sentMessage.poll.id;
      users[chatId].activePoll = pollId;
      polls[pollId] = message;
    });
};

const thirdTopic = (message: Message) => {
  const chatId = message.chat.id;
  set(users, `${chatId}.fullName`, message.text);

  void bot.sendMessage(
    chatId,
    `Тема 3: Правила этикета при общении с инвалидами с умственными нарушениями
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

const thirdTopicTest1 = (message: Message) => {
  const chatId = message.chat.id;
  bot
    .sendPoll(
      chatId,
      'Вопрос 1. Как поздороваться с гостем с умственной отсталостью?',
      [
        'Подойти и протянуть руку для рукопожатия.',
        'Поздороваться словами и улыбнуться.',
        'Дождаться, пока гость сам проявит инициативу для общения.',
      ]
    )
    .then((sentMessage) => {
      const pollId = sentMessage.poll.id;
      users[chatId].activePoll = pollId;
      polls[pollId] = message;
    });
};

const thirdTopicTest2 = (message: Message) => {
  const chatId = message.chat.id;
  bot
    .sendPoll(
      chatId,
      'Вопрос 2. Как себя вести, если гость с умственной отсталостью ведёт себя агрессивно?',
      [
        'Оставаться спокойным и попытаться понять причину агрессии.',
        'Не обращать внимания и продолжать общение как ни в чём не бывало.',
        'Сразу же прекратить общение и сообщить о ситуации менеджеру.',
      ]
    )
    .then((sentMessage) => {
      const pollId = sentMessage.poll.id;
      users[chatId].activePoll = pollId;
      polls[pollId] = message;
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
    [Step.FirstTopicTest1]: firstTopicTest1,
    [Step.FirstTopicTest2]: firstTopicTest2,
    [Step.FirstTopicTest3]: firstTopicTest3,

    [Step.SecondTopic]: secondTopic,
    [Step.SecondTopicTest1]: secondTopicTest1,
    [Step.SecondTopicTest2]: secondTopicTest2,

    [Step.ThirdTopic]: thirdTopic,
    [Step.ThirdTopicTest1]: thirdTopicTest1,
    [Step.ThirdTopicTest2]: thirdTopicTest2,

    [Step.Finish]: finish,
  }[step];

  handle?.(message);
};

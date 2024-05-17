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
  nextStep,
  users,
  polls,
} from './impls';
import { set } from 'lodash';

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
  const chatId = query.message.chat.id;
  if (query.data.startsWith('/done')) {
    void bot.editMessageReplyMarkup(null, {
      inline_message_id: query.inline_message_id,
      message_id: query.message.message_id,
      chat_id: query.message.chat.id,
    });

    const params = new URLSearchParams(query.data.split('?')[1]);

    steps[chatId] = Number(params.get('step'));
    commands['default'](query.message);
  }
});

bot.on('poll', async (poll) => {
  const message = polls[poll.id];
  if (!message) {
    return;
  }

  const chatId = message.chat.id;
  if (users[chatId].activePoll === poll.id) {
    const answer = poll.options.find(({ voter_count }) => voter_count > 0).text;
    users[chatId].answers = {
      ...users[chatId].answers,
      [poll.question]: answer,
    };
    nextStep(message);
    commands['default'](message);
  }
});

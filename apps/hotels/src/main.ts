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
} from './impls';

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
    const params = new URLSearchParams(query.data.split('?')[1]);

    steps[chatId] = Number(params.get('step'));
    commands['default'](query.message);
  }
});

import TelegramBot from 'node-telegram-bot-api';

// replace the value below with the Telegram token you receive from @BotFather
// const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const token = process.env.TELEGRAM_API_KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const users = {};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Check if user has started conversation and set up user state
  if (!users[chatId]) {
    users[chatId] = {step: 'askFirstNameAndOccupation'};
  }

  const user = users[chatId];

  switch (user.step) {
    case 'askFirstNameAndOccupation':
      user.metadata = msg.text;
      user.step = 'sendTopic';
      bot.sendMessage(chatId, 'Введите Ваши ФИО, должность:');
      break;
    case 'sendTopic':
      user.step = 'sendTest';
      bot.sendMessage(chatId, 'Тема 1: Правила этикета при коммуникации со слепыми людьми');
      // Here you should send your video or text material
      bot.sendMessage(chatId, 'Пожалуйста, посмотрите это видео: [здесь ссылка]', {
        reply_markup: {
          keyboard: [[{text: 'Готово'}]]
        }
      });
      break;
    case 'sendTest':
      // Handle OK button after watching video
      if (msg.text.toLowerCase() === 'готово') {
        user.step = 'testReceived';
        // Send the test questions
        bot.sendMessage(chatId, 'Ваш вопрос: Как вы должны себя вести, если встретили слепого человека?', {
          reply_markup: {
            remove_keyboard: true
          }
        });
      }
      break;
    case 'testReceived':
      // Process the test answer
      user.step = 'thankYou';
      bot.sendMessage(chatId, 'Спасибо за то, что прошли тестирование.');
      break;
    default:
      bot.sendMessage(chatId, 'Прошу прощения, я не понял Вашего сообщения. Попробуйте снова.');
      delete users[chatId];
  }
});

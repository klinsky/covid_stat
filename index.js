require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.bot_token);
bot.start((ctx) => ctx.reply(`Здарова, ${ctx.message.from.first_name}!
Чтобы получить статистику, тыкай на кнопки или пиши страну самостоятельно`,
Markup.keyboard([
  ['Ukraine', 'US'],
  ['Russia', 'Belarus'],
  ['Italy', 'Poland'],
])
  .resize()
  .extra()
));
bot.help((ctx) => ctx.reply('Денег дай, потом помогу'));
// bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.hears('привет', (ctx) => ctx.reply('Ну привет'));
bot.hears('Привет', (ctx) => ctx.reply('Драсте'));
bot.hears('Максим здоров?', (ctx) => ctx.reply('Пфф, конечно! Ведь двери в подъезд открывает Катя!'));

bot.on('text', async (ctx) => {
  let data = {};
  
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
    `;
    ctx.reply(formatData || 'Пфф, конечно! Ведь двери в подъезд открывает Катя!');
  } catch { 
      ctx.reply('ЭЭ, на английском страну вводи, мне за перевод не платят! или смотри /help.');
    }
});

bot.launch();

require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.bot_token);
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name}!
Чтобы получить статистику, выбери страну страну или впиши самостоятельно, перечень всех стран доступен по команде /countries `,
Markup.keyboard([
  ['Ukraine', 'USA'],
  ['Russia', 'Belarus'],
  ['Italy', 'Poland'],
])
  .resize()
  .extra()
));
bot.command('countries',((ctx) => ctx.reply(COUNTRIES_LIST)));
bot.hears('привет', (ctx) => ctx.reply('Ну привет'));
bot.hears('Привет', (ctx) => ctx.reply('Драсте'));
bot.hears('Максим здоров?', (ctx) => ctx.reply('Пфф, конечно! Ведь двери в подъезд открывает Катя!'));

bot.on('text', async (ctx) => {
  let data = {};
  
  try {
    data = await api.getReports(ctx.message.text);
    const country = ctx.message.text.toLowerCase()
    const table = data[0].map(item => item.table).map(item => item);
    const countries = table[0][0]
    let filteredCountry = []
    countries.map(change => { return { Country: change.Country.toLowerCase(),
      TotalCases: change.TotalCases,
      NewCases: change.NewCases,
      TotalDeaths: change.TotalDeaths,
      TotalRecovered: change.TotalRecovered }}).forEach(event => { filteredCountry.push(event);})
    let formatedData = filteredCountry.filter(item => item.Country === country)
    const formatData = `
Страна: ${country.charAt(0).toUpperCase() + country.substr(1).toLowerCase()}
Всего заболевших: ${formatedData[0].TotalCases}
Новых случаев: ${formatedData[0].NewCases}
Смертей: ${formatedData[0].TotalDeaths}
Вылечились: ${formatedData[0].TotalRecovered}
    `;
    ctx.reply(formatData);
  } catch { 
      ctx.reply('Неверное название! Перечень всех стран здесь /countries');
    }
});

bot.launch();

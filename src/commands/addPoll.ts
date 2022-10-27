import { Telegraf } from 'telegraf';
import { adminIds } from './../adminIds';

export const addPoll = Telegraf.on('text', (ctx) => {
  const typeOfChat = ctx.chat?.type;
  const id = ctx.message.from.id;
  if (typeOfChat !== 'private' && adminIds.includes(id)) {
    if (ctx.message.text.toLowerCase().includes('опрос')) {
      const title = ctx.message.text.match(/название[:\s]*([\p{sc=Cyrillic}\s]+)[.?\n]/imu);
      const options = ctx.message.text.match(/варианты[:\s]([\p{sc=Cyrillic}\s,]+)/imu);
      return title && options
        ? ctx.telegram.sendPoll(ctx.chat.id, title[1].trim(), options[1].trim().split(', '))
        : ctx.reply('Не получилось');
    }
  }
});

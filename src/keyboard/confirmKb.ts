import { Markup } from 'telegraf';

export const confirmKb = Markup.inlineKeyboard([
  [
    Markup.button.callback('Да, верно', 'yes'),
    Markup.button.callback('Ой, ошибся', 'no'),
  ],
]);

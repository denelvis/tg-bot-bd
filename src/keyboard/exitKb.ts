import { Markup } from 'telegraf';

export const exitKb = Markup.keyboard(['выход']).oneTime().resize();
export const removeKb = Markup.removeKeyboard();

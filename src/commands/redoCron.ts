import { congratulateCron } from '../middlewares/congratulateCron';
import { adminIds } from '../adminIds';
import { ExtendedContext } from '../types/context';
import { bot } from '../app';

export const redoCron = async (ctx: ExtendedContext) => {
  const typeOfChat = ctx.chat?.type;
  const id = ctx.message?.from.id;
  if (typeOfChat === 'private' && !adminIds.includes(id!)) {
    return;
  }
  await congratulateCron(bot);
  await ctx.reply('Расписание поздравлений обновлено');
};

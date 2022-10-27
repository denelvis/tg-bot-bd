import { User } from '../services/models/user';
import cron from 'node-cron';
import { ExtendedContext } from '../types/context';
import { Telegraf } from 'telegraf';
import { calendar } from './../utils/calendar';
import { bdateHour } from '../constants/congratulate';

export const congratulateCron = async (ctx: Telegraf<ExtendedContext>) => {

  const sortedAndFilteredMapBirthdateUserId = await calendar();

  Object.keys(sortedAndFilteredMapBirthdateUserId).map((date) => {
    const serverTzOffset = new Date().getTimezoneOffset() / 60;
    const bdateUTCHour = bdateHour + serverTzOffset;
    const mounth = date.split('-').slice(0, 1)[0];
    const day = date.split('-').slice(1)[0];
    const userIds = sortedAndFilteredMapBirthdateUserId[date];
    return userIds.map(async (id) => {
      const tzOffset = await User.findOne({ attributes: ['timezone_offset'], where: { user_id: id }, raw: true });
      const offset = tzOffset ? tzOffset.timezone_offset / 60 : 0;
      return cron.schedule(`0 0 ${bdateUTCHour - offset} ${day} ${mounth} *`, async () => {
        await ctx.telegram?.sendMessage(id, 'CONGRATULATION TEXT');
      });
    });
  });
};

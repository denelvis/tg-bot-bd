import { User } from '../services/models/user';
import cron from 'node-cron';
import { ExtendedContext } from '../types/context';
import { Telegraf } from 'telegraf';
import { calendar } from '../utils/calendar';
import { bdateHour, groupId } from '../constants/congratulate';

export const congratulateCronInGroup = async (ctx: Telegraf<ExtendedContext>) => {
  const sortedAndFilteredMapBirthdateUserId = await calendar();

  Object.keys(sortedAndFilteredMapBirthdateUserId).map((date) => {
    const serverTzOffset = new Date().getTimezoneOffset() / 60;
    const bdateUTCHour = bdateHour + serverTzOffset;
    const mounth = date.split('-').slice(0, 1)[0];
    const day = date.split('-').slice(1)[0];
    const userIds = sortedAndFilteredMapBirthdateUserId[date];
    return userIds.map(async (id) => {
      const user = await User.findOne({
        attributes: ['timezone_offset', 'first_name', 'last_name', 'gender'],
        where: { user_id: id },
        raw: true,
      });
      const offset = user ? user.timezone_offset / 60 : 0;
      return cron.schedule(`0 0 ${bdateUTCHour - offset} ${day} ${mounth} *`, async () => {
        if (user?.gender === 'm') {
          return ctx.telegram?.sendMessage(
            groupId,
            `CONGRATULATION TEXT for men ${user?.first_name} ${user?.last_name}`
          );
        } else if (user?.gender === 'f') {
          return ctx.telegram?.sendMessage(
            groupId,
            `CONGRATULATION TEXT for women ${user?.first_name} ${user?.last_name}`
          );
        } else {
          return ctx.telegram?.sendMessage(
            groupId,
            `CONGRATULATION TEXT common ${user?.first_name} ${user?.last_name}`
          );
        }
      });
    });
  });
};

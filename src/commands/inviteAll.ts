import { ExtendedContext } from './../types/context';
import { User } from '../services/models/user';
import dayjs from 'dayjs';
import cron from 'node-cron';
import { CalendarType } from '../types/calendarUser';

export const inviteAll = async (ctx: ExtendedContext) => {
  const typeOfChat = ctx.chat?.type;
  if (typeOfChat === 'private') {
    return;
  }
  const data = await ctx.createChatInviteLink();
  const chatId = ctx.message!.chat.id;
  const senderId = ctx.message?.from.id;
  const currentTime = dayjs(new Date()).format('MM-DD');
  const dateShiftForClean = 2;

  const getUsers = await User.findAll({ attributes: ['user_id', 'birthdate'], raw: true });

  const mapBirthdateUserId: CalendarType = {};
  getUsers.map((user) => {
    const key = user?.birthdate.slice(5);
    const value = user?.user_id;
    if (mapBirthdateUserId[key]) {
      mapBirthdateUserId[key].push(value);
    } else {
      mapBirthdateUserId[key] = [value];
    }
    return mapBirthdateUserId;
  });

  const bdateSoon = Object.keys(mapBirthdateUserId)
    .map((date) => {
      if (
        +date.split('-').slice(0, 1) === +currentTime.split('-').slice(0, 1) &&
        +date.split('-').slice(1) - +currentTime.split('-').slice(1) <= 2 &&
        +date.split('-').slice(1) - +currentTime.split('-').slice(1) > 0
      ) {
        return mapBirthdateUserId[date];
      }
    })
    .filter(Boolean)
    .flat();

  const resultId = Object.values(mapBirthdateUserId)
    .flat()
    .filter((id) => !bdateSoon.includes(id));

  [...resultId, chatId].map(
    async (id) => await ctx.telegram.sendMessage(id, `Приглашаем Вас в группу для поздравлений\n${data.invite_link}`)
  );

  const cleanIds = resultId.filter((id) => id !== senderId);
  cleanIds.map(async (id) => {
    return cron.schedule(
      `0 6 ${currentTime.split('-').slice(1)} ${+currentTime.split('-').slice(0, 1) + dateShiftForClean} *`,
      async () => await ctx.banChatMember(id)
    );
  });
};

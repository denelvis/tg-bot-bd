import dayjs from 'dayjs';
import { CalendarType } from '../types/calendarUser';
import { User } from '../services/models/user';
import { ExtendedContext } from '../types/context';

export const clean = async (ctx: ExtendedContext) => {
  const typeOfChat = ctx.chat?.type;
  if (typeOfChat === 'private') {
    return;
  }
  const senderId = ctx.message?.from.id;
  const currentTime = dayjs(new Date()).format('MM-DD');

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
        +date.split('-').slice(1) - +currentTime.split('-').slice(1) <= 0 &&
        +date.split('-').slice(1) - +currentTime.split('-').slice(1) >= -2
      ) {
        return mapBirthdateUserId[date];
      }
    })
    .filter(Boolean)
    .flat();

  const resultId = Object.values(mapBirthdateUserId)
    .flat()
    .filter((id) => !bdateSoon.includes(id))
    .filter((id) => id !== senderId);
  resultId.map(async (id) => await ctx.banChatMember(id));
};

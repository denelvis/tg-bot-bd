import { ExtendedContext } from './../types/context';
import { startDb } from '../services/db';
import { adminIds } from '../adminIds';
import { User } from '../services/models/user';
import { messageSwitch } from '../utils/messageSwitch';
import { initString } from './../utils/messageSwitch';
import { CalendarUserType } from '../types/calendarUser';

export const syncDb = async (ctx: ExtendedContext) => {
  const typeOfChat = ctx.chat?.type;
  const id = ctx.message?.from.id;
  if (typeOfChat === 'private' && !adminIds.includes(id!)) {
    return;
  }
  await startDb();
  await ctx.reply('База данных подключена и синхронизирована');

  const calendarUsers = await User.findAll({ raw: true });

  if (calendarUsers.length !== 0) {
    const sortedCalendar = calendarUsers.sort(
      (a, b) => +a.birthdate.split('-').slice(1).join('') - +b.birthdate.split('-').slice(1).join('')
    );

    const result = sortedCalendar.reduce((acc, obj) => {
      const key = obj.birthdate.split('-').slice(1).join('-');

      return {
        ...acc,
        [key]: [...(acc[key] ? acc[key] : []), obj.last_name].sort(),
      };
    }, {} as CalendarUserType);

    const separateObject = (obj: Record<string, string[]>) => {
      const res: CalendarUserType[] = [];
      const keys = Object.keys(obj);
      keys.forEach((key) => {
        res.push({
          [key]: obj[key],
        });
      });
      return res;
    };

    const resultArray = separateObject(result);

    const message = resultArray.reduce((acc, obj) => {
      const month = Object.keys(obj)[0].split('-')[0];
      const day = Object.keys(obj)[0].split('-')[1];
      const name = Object.values(obj)[0].join('; ');

      return messageSwitch(acc, month, day, name);
    }, initString);

    return ctx.replyWithMarkdown(message);
  }
};

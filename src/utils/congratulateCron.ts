import { User } from '../services/models/user';
import cron from 'node-cron';
import { SceneWizardContext } from '../types/context';
import { Telegraf } from 'telegraf';

export const congratulateCron = async (ctx: Telegraf<SceneWizardContext>) => {
  const getUsers = await User.findAll();
  const currentTime = new Date();
  const currentMonth =
    currentTime.getMonth() + 1 < 10 ? `0${currentTime.getMonth() + 1}` : `${currentTime.getMonth() + 1}`;
  const currentDay = currentTime.getDate() < 10 ? `0${currentTime.getDate()}` : `${currentTime.getDate()}`;
  const dayMonth = currentMonth + '-' + currentDay;
  const mapBirthdateUserId: { [key: string]: number[] } = {};
  getUsers.map((user) => {
    const key = user?.getDataValue('birthdate').slice(5);
    const value = user?.getDataValue('user_id');
    if (mapBirthdateUserId[key]) {
      mapBirthdateUserId[key].push(value);
    } else {
      mapBirthdateUserId[key] = [value];
    }
    return mapBirthdateUserId;
  });
  const sortedAndFilteredMapBirthdateUserId = Object.keys(mapBirthdateUserId)
    .sort()
    .filter((el) => el >= dayMonth)
    .reduce((obj: { [key: string]: number[] }, key: string) => {
      obj[key] = mapBirthdateUserId[key].sort();
      return obj;
    }, {});

  const jobs = Object.keys(sortedAndFilteredMapBirthdateUserId).map((date) => {
    const bdateHour = 9;
    const serverTzOffset = currentTime.getTimezoneOffset() / 60;
    const bdateUTCHour = bdateHour + serverTzOffset;
    const mounth = date.split('-').slice(0, 1)[0];
    const day = date.split('-').slice(1)[0];
    const userIds = sortedAndFilteredMapBirthdateUserId[date];
    return userIds.map(async (id) => {
      const tzOffset = await User.findOne({ attributes: ['timezone_offset'], where: { user_id: id } });
      const offset = tzOffset?.toJSON().timezone_offset / 60;
      return cron.schedule(`* * ${bdateUTCHour - offset} ${day} ${mounth} *`, () => {
        ctx.telegram?.sendMessage(id, 'well done!!!');
      });
    });
  });

  setTimeout(() => jobs.flat().map(async (job) => (await job).stop()), 1200);
  return console.log(sortedAndFilteredMapBirthdateUserId);
};

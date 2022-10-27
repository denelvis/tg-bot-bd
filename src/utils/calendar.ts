import { CalendarType } from '../types/calendarUser';
import { User } from '../services/models/user';

export const calendar = async (filter = false) => {
  const getUsers = await User.findAll({ attributes: ['user_id', 'birthdate'], raw: true });
  const currentTime = new Date();
  const currentMonth =
    currentTime.getMonth() + 1 < 10 ? `0${currentTime.getMonth() + 1}` : `${currentTime.getMonth() + 1}`;
  const currentDay = currentTime.getDate() < 10 ? `0${currentTime.getDate()}` : `${currentTime.getDate()}`;
  const dayMonth = currentMonth + '-' + currentDay;
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
  if (filter) {
    const sortedAndFilteredMapBirthdateUserId = Object.keys(mapBirthdateUserId)
      .sort()
      .filter((el) => el >= dayMonth)
      .reduce((obj: CalendarType, key: string) => {
        obj[key] = mapBirthdateUserId[key].sort();
        return obj;
      }, {});
    return sortedAndFilteredMapBirthdateUserId;
  } else {
    const sortedAndFilteredMapBirthdateUserId = Object.keys(mapBirthdateUserId)
      .sort()
      .reduce((obj: CalendarType, key: string) => {
        obj[key] = mapBirthdateUserId[key].sort();
        return obj;
      }, {});
    return sortedAndFilteredMapBirthdateUserId;
  }
};

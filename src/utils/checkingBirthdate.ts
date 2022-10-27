import { User } from '../services/models/user';

export const checkingBirthdate = async () => {
  const users = await User.findAll();
  const birthdates = users.map((user) => {
    return user?.getDataValue('birthdate');
  });
  return console.log(birthdates);
};

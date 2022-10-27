import { User } from '../services/models/user';
import { DateFormats, formatDate } from '../utils/formatDate';
import { ExtendedContext } from './../types/context';

export const birthdate = async (ctx: ExtendedContext) => {
  const { id } = ctx.message!.from;
  const user = await User.findOne({
    attributes: ['birthdate'],
    where: { user_id: id },
    raw: true,
  });
  if (user?.birthdate) {
    const birthdate = user?.birthdate;
    await ctx.reply(
      `Вы уже указали свой день рождения: ${formatDate(birthdate, DateFormats.SERVER, DateFormats.USER)}`
    );
    return;
  }
  ctx.scene.enter('birthdate');
};

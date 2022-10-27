import { CreationAttributes } from 'sequelize';
import { Composer, Scenes } from 'telegraf';
import { UserInstance } from '../types/modelDb';
import { confirmKb } from '../keyboard/confirmKb';
import { exitKb, removeKb } from '../keyboard/exitKb';
import { User } from '../services/models/user';
import { ExtendedContext } from '../types/context';
import { formatDate } from '../utils/formatDate';
import { isValidDate } from '../utils/validationDate';

const enterBirthdate = new Composer<ExtendedContext>();
enterBirthdate.command('birthdate', async (ctx) => {
  await ctx.reply('Пожалуйста, введите, Ваше день рождения в формате дд.мм.гггг', exitKb);
  return ctx.wizard.next();
});

const confirmBirthdate = new Composer<ExtendedContext>();
confirmBirthdate.on('text', async (ctx) => {
  if (isValidDate(ctx.message.text)) {
    const {
      text,
      date,
      from: { id, username, first_name, last_name },
    } = ctx.message;
    ctx.scene.state.data = {
      user_id: id,
      username,
      first_name,
      last_name,
      birthdate: `${formatDate(text)}`,
      timezone_offset: new Date(date).getTimezoneOffset(),
    };
    await ctx.reply(`Ваше день рождение ${text}?`, confirmKb);
    return ctx.wizard.next();
  } else {
    await ctx.reply('Пожалуйста, введите, корректный день рождения');
    return ctx.wizard.selectStep(ctx.wizard.cursor);
  }
});

const lastStep = new Composer<ExtendedContext>();
lastStep.action('yes', async (ctx) => {
  // ctx.session.data = ctx.scene.state.data;
  await User.create({ ...ctx.scene.state.data } as CreationAttributes<UserInstance>);
  await ctx.answerCbQuery('');
  await ctx.reply('Спасибо', removeKb);
  return ctx.scene.leave();
});
lastStep.action('no', async (ctx) => {
  await ctx.answerCbQuery('');
  await ctx.reply('Повторите ввод');
  return ctx.wizard.back();
});

export const bdateScene = new Scenes.WizardScene<ExtendedContext>(
  'birthdate',
  enterBirthdate,
  confirmBirthdate,
  lastStep
);

export const stage = new Scenes.Stage<ExtendedContext>([bdateScene]);
stage.hears('выход', async (ctx) => {
  await ctx.reply('Пока!', removeKb);
  ctx.scene.leave();
});

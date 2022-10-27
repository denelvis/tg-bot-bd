import { Telegraf, session } from 'telegraf';
import cron from 'node-cron';
import dotenv from 'dotenv-flow';
import { ExtendedContext } from './types/context';

import { startDb } from './services/db';
import { birthdate } from './commands/birthdate';
import { clean } from './commands/clean';
import { inviteAll } from './commands/inviteAll';
import { redoCron } from './commands/redoCron';
import { syncDb } from './commands/syncDb';
// import { congratulateCron } from './middlewares/congratulateCron';
import { ignoreChatMessage } from './middlewares/ignoreChatMessage';
import { congratulateCronInGroup } from './middlewares/congratulateCronInGroup';
import { stage } from './scenes/bdateScene';
import { addPoll } from './commands/addPoll';

dotenv.config({ silent: true });

export const bot = new Telegraf<ExtendedContext>(process.env.BOT_TOKEN!);

bot.use(stage, session(), stage.middleware());

bot.telegram.setMyCommands([{ command: 'birthdate', description: 'проверить или указать день рождения' }]);

bot.command('birthdate', (ctx, next) => ignoreChatMessage(ctx, next), birthdate);
bot.command('inviteAll', (ctx, next) => ignoreChatMessage(ctx, next), inviteAll);
bot.command('syncDb', (ctx, next) => ignoreChatMessage(ctx, next), syncDb);
bot.command('redoCron', (ctx, next) => ignoreChatMessage(ctx, next), redoCron);
bot.command('clean', (ctx, next) => ignoreChatMessage(ctx, next), clean);
bot.on('text', (ctx, next) => ignoreChatMessage(ctx, next), addPoll);

const launchDb = async () => await startDb();
launchDb();
// const launchCongratulation = async () => await congratulateCron(bot);
// launchCongratulation();
const launchCongratulationInGroup = async () => await congratulateCronInGroup(bot);
launchCongratulationInGroup();

cron.schedule('0 6 * * 1-7', async () => await launchDb());

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

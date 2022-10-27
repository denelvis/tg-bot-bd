import { CreationAttributes } from 'sequelize';
import { ChatUserInstance } from '../types/modelDb';
import { ExtendedContext } from '../types/context';
import { ChatUser } from '../services/models/user';

export const ignoreChatMessage = async (ctx: ExtendedContext, next: () => Promise<void>) => {
  const typeOfChat = ctx.chat?.type;
  const { id: chat_id } = ctx.chat!;
  const { id: user_id, username, first_name, last_name } = ctx.message!.from;

  const chatUser = await ChatUser.findOne({ where: { user_id } });

  if (!chatUser) {
    await ChatUser.create({
      chat_id,
      user_id,
      username,
      first_name,
      last_name,
    } as CreationAttributes<ChatUserInstance>);
  }

  if (typeOfChat === 'private') {
    next();
  }
  if (typeOfChat !== 'private') {
    const getAdmins = await ctx.getChatAdministrators();
    const adminIds = getAdmins.map((user) => user.user.id);
    const id = ctx.message?.from.id;
    if (adminIds.includes(id!)) {
      next();
    }
  }
};

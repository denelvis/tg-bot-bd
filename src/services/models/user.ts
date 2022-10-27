import { DataTypes } from 'sequelize';
import { ChatUserModelStatic, UserModelStatic } from '../../types/modelDb';
import { sequelize } from '../db';

export const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING({ length: 256 }),
  },
  first_name: {
    type: DataTypes.STRING({ length: 256 }),
  },
  last_name: {
    type: DataTypes.STRING({ length: 256 }),
  },
  gender: {
    type: DataTypes.STRING({ length: 4 }),
  },
  timezone_offset: {
    type: DataTypes.SMALLINT,
  },
}) as UserModelStatic;

export const ChatUser = sequelize.define('chat_user', {
  chat_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING({ length: 256 }),
  },
  first_name: {
    type: DataTypes.STRING({ length: 256 }),
  },
  last_name: {
    type: DataTypes.STRING({ length: 256 }),
  },
}) as ChatUserModelStatic;

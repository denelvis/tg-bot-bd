import { BuildOptions, Model } from 'sequelize';

interface UserAttributes {
  readonly id: number;
  readonly user_id: number;
  readonly timezone_offset: number;
  readonly birthdate: string;
  readonly username: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly gender: string;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
export type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserInstance;
};

interface ChatUserAttributes {
  readonly id: number;
  readonly chat_id: number;
  readonly user_id: number;
  readonly username: string;
  readonly first_name: string;
  readonly last_name: string;
}

export interface ChatUserInstance extends Model<ChatUserAttributes>, ChatUserAttributes {}
export type ChatUserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ChatUserInstance;
};

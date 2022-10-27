import { Scenes } from 'telegraf';
import { DataProps } from './scene';

export interface SessionDataProps extends Scenes.WizardSession {
  data?: DataProps;
}

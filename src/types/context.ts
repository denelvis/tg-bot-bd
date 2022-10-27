import { Context } from 'telegraf';
import { WizardContextWizard } from 'telegraf/typings/scenes';
import { SessionDataProps } from './session';
import { SceneDataProps } from './scene';

type bdate = string;

export interface ExtendedContext extends Context {
  db?: bdate;
  session: SessionDataProps;
  scene: SceneDataProps;
  wizard: WizardContextWizard<ExtendedContext>;
}

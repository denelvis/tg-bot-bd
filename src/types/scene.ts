import { SceneContextScene, WizardSessionData } from 'telegraf/typings/scenes';
import { ExtendedContext } from './context';

export interface DataProps {
  user_id: number;
  timezone_offset: number;
  birthdate: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}
export interface StateSceneDataProps {
  data?: DataProps;
}

export interface SceneDataProps extends SceneContextScene<ExtendedContext, WizardSessionData> {
  state: StateSceneDataProps;
}

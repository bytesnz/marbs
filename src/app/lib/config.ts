import * as Configs from '../../../typings/configs';

import globalConfig from 'Config';
import defaultConfig from '../../lib/defaults/config.global';

export const config: Configs.SetGlobalConfig = {
  ...defaultConfig,
  ...globalConfig
};
export default config;

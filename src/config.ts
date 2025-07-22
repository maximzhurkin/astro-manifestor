// noinspection SpellCheckingInspection

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { defaultConfig } from './types';
import type { Config } from './types';

export async function loadConfig(cliOptions: Partial<Config>): Promise<Config> {
  const configPathTs = path.resolve(process.cwd(), 'astro-manifestor.config.ts');
  const configPathJs = path.resolve(process.cwd(), 'astro-manifestor.config.js');

  let userConfig: Partial<Config> = {};

  if (existsSync(configPathTs) || existsSync(configPathJs)) {
    const configPath = existsSync(configPathTs) ? configPathTs : configPathJs;
    const configModule = await import(pathToFileURL(configPath).href);

    userConfig = configModule.default || configModule;
  }

  return {
    ...defaultConfig,
    ...userConfig,
    ...cliOptions,
  };
}
// noinspection SpellCheckingInspection

import {describe, it, expect} from 'vitest';
import {loadConfig} from '../src/config';
import {setupFixturesBase} from '../src/utils/setupFixturesBase';
import {Config} from "../src/types";

describe('unit: loadConfig', () => {
  setupFixturesBase();

  it('loads config from astro-manifestor.config.ts', async () => {
    const config = await loadConfig({});

    expect(config.inputDir).toBe('dist');
    expect(config.verbose).toBe(true);
  });

  it('cliOptions override config file', async () => {
    const cliOptions: Partial<Config> = {verbose: false, inlineScriptsOutDir: '/custom-assets'};
    const config = await loadConfig(cliOptions);

    expect(config.inputDir).toBe('dist');
    expect(config.verbose).toBe(false);
    expect(config.inlineScriptsOutDir).toBe('/custom-assets');
  });
});
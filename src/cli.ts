#!/usr/bin/env node
// noinspection SpellCheckingInspection

import {cac} from 'cac';
import {astroManifestor} from './index';
import {loadConfig} from './config';

const cli = cac('astro-manifestor');

cli
  .option('--inputDir [path]', 'Directory with HTML files (e.g. dist)')
  .option('--manifestOutFile [path]', 'Path and filename for output manifest (e.g. dist/assets/manifest.json)')
  .option('--inlineScriptsOutDir [path]', 'Directory to write extracted inline scripts (e.g. dist/assets/js)')
  .option('--inlineScriptsPublicPath [url]', 'Public URL path for src="" (e.g. /assets/js)')
  .option('--inlineScriptPrefix [prefix]', 'Prefix for extracted inline script filenames (e.g. inline-script-)')
  .option('--verbose', 'Enable verbose logging (e.g. true)')

cli.help();

cli.command('').action(async (cliOptions) => {
  console.log('[CLI] parsed options:', cliOptions);

  const con = await loadConfig(cliOptions);
  console.log('[CLI] resolved config:', con);

  await astroManifestor(con);
  console.log('[CLI] done');

  const config = await loadConfig(cliOptions);
  await astroManifestor(config);
});

cli.parse();
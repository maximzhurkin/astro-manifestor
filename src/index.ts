// noinspection SpellCheckingInspection

import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {processHtmlFiles} from './processor/processHtmlFiles';
import {resolveHtmlFiles} from './utils/resolveHtmlFiles';
import type {Config} from './types';

export async function astroManifestor(config: Config) {
  if (config.verbose) {
    console.log(`[astro-manifestor] 🔍 Resolving HTML files in: ${config.inputDir}`);
  }

  const htmlFiles = resolveHtmlFiles(config.inputDir);

  if (config.verbose) {
    console.log(`[astro-manifestor] 🧾 Found ${htmlFiles.length} HTML files`);
  }

  const manifestData = await processHtmlFiles(htmlFiles, config);

  const finalManifest = config.transformManifest
    ? await config.transformManifest(manifestData)
    : manifestData;

  mkdirSync(dirname(config.manifestOutFile), { recursive: true });

  await writeFile(
    config.manifestOutFile,
    JSON.stringify(finalManifest, null, 2),
    'utf8'
  );

  if (config.verbose) {
    console.log(`[astro-manifestor] ✅ Manifest written to ${config.manifestOutFile}`);
  }

  return manifestData;
}
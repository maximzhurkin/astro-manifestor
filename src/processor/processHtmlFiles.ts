// noinspection SpellCheckingInspection

import path from 'node:path';
import fs from 'node:fs';
import { inlineScripts } from './inlineScripts';
import { findResources } from './findResources';
import { formatHtml } from './formatHtml';
import type { ManifestEntry, Config } from '../types';

export async function processHtmlFiles(
  filePaths: string[],
  config: Config,
): Promise<Record<string, ManifestEntry>> {
  const manifest: Record<string, ManifestEntry> = {};

  for (const filePath of filePaths) {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      if (config.verbose) console.warn(`[astro-manifestor] File not found: ${absolutePath}`);
      continue;
    }

    try {
      if (config.verbose) console.log(`[astro-manifestor] Processing ${filePath}`);

      inlineScripts(absolutePath, config);
      await formatHtml(absolutePath, config.prettierOptions ?? {});

      manifest[filePath] = findResources(absolutePath);
    } catch (err) {
      console.error(`[astro-manifestor] Error processing ${filePath}:`, (err as Error).message);
    }
  }

  return manifest;
}
// noinspection SpellCheckingInspection

import {describe, it, expect} from 'vitest';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import fs from 'node:fs';
import {
  ensureTmpRoot,
  createTempDir,
  cleanupTempDir,
} from '../src/utils/setupFixturesBase';
import type {ManifestMap} from "../src/types";

const execFileAsync = promisify(execFile);

describe('integration: CLI integration', () => {
  it('runs astro-manifestor CLI with fixture and produces expected output', async () => {
    ensureTmpRoot();
    const tempDir = createTempDir();

    const fixturesDir = path.resolve(__dirname, './fixtures');
    fs.cpSync(fixturesDir, tempDir, {recursive: true});

    const inputDir = path.join(tempDir, 'dist');
    const manifestOutFile = path.join(tempDir, 'dist/assets/manifest.json');
    const inlineScriptsOutDir = path.join(tempDir, 'dist/assets/js');
    const inlineScriptsPublicPath = '/assets/js';
    const inlineScriptPrefix = 'inline-script-';

    const cliPath = path.resolve(__dirname, '../dist/cli.js');

    const args = [
      '--inputDir', inputDir,
      '--manifestOutFile', manifestOutFile,
      '--inlineScriptsOutDir', inlineScriptsOutDir,
      '--inlineScriptsPublicPath', inlineScriptsPublicPath,
      '--inlineScriptPrefix', inlineScriptPrefix,
      '--verbose',
    ];

    const {stdout} = await execFileAsync('node', [cliPath, ...args], {
      cwd: tempDir,
    });

    expect(stdout).toContain('Resolving HTML files in');
    expect(stdout).toContain('Found 2 HTML files');
    expect(stdout).toContain('[astro-manifestor] Processing dist/index.html');
    expect(stdout).toContain('[astro-manifestor] Processing dist/about/index.html');
    expect(stdout).toContain('Manifest written to');
    expect(stdout).toContain('[CLI] done');

    expect(fs.existsSync(manifestOutFile)).toBe(true);
    const manifestContent = fs.readFileSync(manifestOutFile, 'utf8');
    const manifest = JSON.parse(manifestContent) as ManifestMap;

    expect(typeof manifest).toBe('object');
    expect(Object.keys(manifest).length).toBeGreaterThan(0);

    for (const entry of Object.values(manifest)) {
      for (const island of Object.values(entry.islands || {})) {
        if (island.componentUrl) {
          expect(island.componentUrl.startsWith('https://example.com')).toBe(true);
        }
      }
    }

    const files = fs.readdirSync(inlineScriptsOutDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files.some(f => f.startsWith(inlineScriptPrefix) && f.endsWith('.js'))).toBe(true);

    // cleanupTempDir(tempDir);
  });
});
import fs from 'node:fs';
import path from 'node:path';
import {expect, it, describe} from 'vitest';
import {setupFixturesBase} from '../src/utils/setupFixturesBase';
import {inlineScripts} from '../src/processor/inlineScripts';
import {defaultConfig} from '../src/types';

describe('unit: inlineScripts', () => {
  setupFixturesBase();

  it('extracts inline scripts from dist/index.html and replaces with external script tags', () => {
    const htmlPath = path.resolve(process.cwd(), 'dist/index.html');
    const inlineScriptsDir = path.resolve(process.cwd(), 'dist/assets/js');

    const before = fs.readFileSync(htmlPath, 'utf-8');
    expect(before).toMatch(/<script>([\s\S]*?)<\/script>/);

    inlineScripts(htmlPath, defaultConfig);

    const files = fs.readdirSync(inlineScriptsDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files.some(f => f.startsWith(defaultConfig.inlineScriptPrefix) && f.endsWith('.js'))).toBe(true);

    const after = fs.readFileSync(htmlPath, 'utf-8');
    expect(after).not.toMatch(/<script>([\s\S]*?)<\/script>/);
    expect(after).toMatch(
      new RegExp(`<script src="${defaultConfig.inlineScriptsPublicPath}/${defaultConfig.inlineScriptPrefix}[a-z0-9]+\\.js"><\\/script>`)
    );
  });
});
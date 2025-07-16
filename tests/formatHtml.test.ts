import {describe, it, expect} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {formatHtml} from '../src/processor/formatHtml';
import {
  ensureTmpRoot,
  createTempDir,
  cleanupTempDir,
} from '../src/utils/setupFixturesBase';

describe('unit: formatHtml', () => {
  it('formats HTML correctly using prettier', async () => {
    ensureTmpRoot();
    const tempDir = createTempDir();

    const filePath = path.join(tempDir, 'test.html');

    const rawHtml = `
      <!DOCTYPE html><html lang="en"><head><style>body {margin:0}</style></head><body>
        <div><p>hello</p></div>
        <script>console.log("test")</script>
      </body></html>
    `;

    fs.writeFileSync(filePath, rawHtml.trim(), 'utf8');

    await formatHtml(filePath, {
      printWidth: 80,
      tabWidth: 2,
    });

    const result = fs.readFileSync(filePath, 'utf8');

    expect(result).toMatch(/<!DOCTYPE html>/i);
    expect(result).toMatch(/<html[^>]*>/);
    expect(result).toMatch(/<script>[\s\S]*?console\.log\("test"\)[\s\S]*?<\/script>/);
    expect(result).not.toMatch(/<\/div><script>/);

    cleanupTempDir(tempDir);
  });
});
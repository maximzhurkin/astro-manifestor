import {describe, it, expect} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {resolveHtmlFiles} from '../src/utils/resolveHtmlFiles';
import {
  ensureTmpRoot,
  createTempDir,
  cleanupTempDir,
} from '../src/utils/setupFixturesBase';

describe('unit: resolveHtmlFiles', () => {
  it('correctly resolves all HTML files relative to cwd', () => {
    ensureTmpRoot();
    const tempDir = createTempDir();

    const files = [
      'index.html',
      'subdir/about.html',
      'subdir/contact.html',
      'script.js',
    ];

    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.mkdirSync(path.dirname(filePath), {recursive: true});
      fs.writeFileSync(filePath, `<html lang="en"><body>${file}</body></html>`, 'utf8');
    });

    process.chdir(tempDir);

    const resolvedFiles = resolveHtmlFiles(tempDir);

    expect(resolvedFiles.length).toBe(3);
    expect(resolvedFiles).toContain('index.html');
    expect(resolvedFiles).toContain(path.join('subdir', 'about.html'));
    expect(resolvedFiles).toContain(path.join('subdir', 'contact.html'));
    expect(resolvedFiles).not.toContain('script.js');

    cleanupTempDir(tempDir);
  });
});
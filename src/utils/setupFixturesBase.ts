import fs from 'node:fs';
import path from 'node:path';
import {beforeAll, beforeEach, afterEach} from 'vitest';
import {randomUUID} from 'node:crypto';

const FIXTURES_DIR = path.resolve(__dirname, '../../tests/fixtures');
const TMP_ROOT_DIR = path.resolve(__dirname, '../../tests/.tmp');

let TMP_DIR: string;
let originalCwd: string;

export function ensureTmpRoot() {
  if (!fs.existsSync(TMP_ROOT_DIR)) {
    fs.mkdirSync(TMP_ROOT_DIR, {recursive: true});
  }
}

export function createTempDir(): string {
  const tmpDir = path.join(TMP_ROOT_DIR, randomUUID());

  fs.mkdirSync(tmpDir);
  return tmpDir;
}

export function cleanupTempDir(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, {recursive: true, force: true});
  }
}

export function setupFixturesBase(): void {
  beforeAll(() => {
    ensureTmpRoot()
    originalCwd = process.cwd();
  });

  beforeEach(() => {
    TMP_DIR = createTempDir()

    fs.cpSync(FIXTURES_DIR, TMP_DIR, {recursive: true});
    process.chdir(TMP_DIR);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    cleanupTempDir(TMP_DIR)
  });
}
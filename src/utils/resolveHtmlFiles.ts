// noinspection SpellCheckingInspection

import {globSync} from 'glob';
import path from 'node:path';

export function resolveHtmlFiles(rootDir: string): string[] {
    return globSync(`${rootDir}/**/*.html`, {
        absolute: false,
        nodir: true,
        ignore: ['**/node_modules/**'],
    }).map(p => path.relative(process.cwd(), p));
}
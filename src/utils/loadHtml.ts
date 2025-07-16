import fs from 'node:fs';
import {load} from 'cheerio';

export function loadHtml(absolutePath: string) {
    const html = fs.readFileSync(absolutePath, 'utf8');
    return load(html);
}
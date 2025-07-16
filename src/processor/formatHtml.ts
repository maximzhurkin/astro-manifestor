import fs from 'node:fs';
import prettier from 'prettier';
import {JSDOM} from 'jsdom';
import type {Options} from 'prettier';
import {defaultConfig} from "../types";

export async function formatHtml(absolutePath: string, options: Options): Promise<void> {
    const html = fs.readFileSync(absolutePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const scripts = [...document.body.querySelectorAll('script:not([type="application/json"])')];
    const styles = [...document.body.querySelectorAll('style')];

    scripts.forEach(script => document.body.appendChild(script));
    styles.forEach(style => document.head.appendChild(style));

    const formatted = await prettier.format(dom.serialize(), {
        parser: 'html',
        ...defaultConfig.prettierOptions,
        ...options,
    });

    fs.writeFileSync(absolutePath, formatted, 'utf8');
}
import fs from 'node:fs';
import path from 'node:path';
import {loadHtml} from '../utils/loadHtml';
import {hashString} from '../utils/hashString';
import type {Config} from "../types";

export function inlineScripts(
  absolutePath: string,
  config: Config,
): void {
  const $ = loadHtml(absolutePath);

  if (!fs.existsSync(config.inlineScriptsOutDir)) {
    fs.mkdirSync(config.inlineScriptsOutDir, {recursive: true});
  }

  $('script:not([src]):not([type="application/json"])').each((_, el) => {
    const content = $(el).html() || '';

    if (!content.trim()) return;

    const hash = hashString(content);
    const fileName = `${config.inlineScriptPrefix}${hash}.js`;
    const filePath = path.join(config.inlineScriptsOutDir, fileName);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }

    $(el).replaceWith(`<script src="${config.inlineScriptsPublicPath}/${fileName}"></script>`);
  });

  fs.writeFileSync(absolutePath, $.html());
}
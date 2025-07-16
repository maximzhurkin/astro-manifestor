import {loadHtml} from '../utils/loadHtml';
import type {Cheerio} from 'cheerio';
import type {AnyNode} from 'domhandler';
import type {ManifestEntry, Island} from '../types';

function attr($el: Cheerio<AnyNode>, name: string) {
    return $el.attr(name) ?? null;
}

export function findResources(path: string): ManifestEntry {
    const $ = loadHtml(path);

    const js = $('script[src]:not([type="application/json"])')
        .map((_, el) => $(el).attr('src')!)
        .get();

    const css = $('link[rel="stylesheet"][href]')
        .map((_, el) => $(el).attr('href')!)
        .get();

    const islands: Record<string, Island> = {};

    $('astro-island').each((_, el) => {
        const $el = $(el);
        const opts = $el.attr('opts');

        if (!opts) return;

        try {
            const {name} = JSON.parse(opts);

            if (!name) return;

            islands[name] = {
                uid: attr($el, 'uid'),
                componentUrl: attr($el, 'component-url'),
                componentExport: attr($el, 'component-export'),
                rendererUrl: attr($el, 'renderer-url'),
                client: attr($el, 'client'),
                props: attr($el, 'props'),
                ssr: attr($el, 'ssr'),
            };
        } catch {
            console.warn('Invalid astro-island opts');
        }
    });

    return {js, css, islands};
}
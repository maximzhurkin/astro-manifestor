import path from 'node:path';
import {describe, it, expect} from 'vitest';
import {setupFixturesBase} from '../src/utils/setupFixturesBase';
import {findResources} from '../src/processor/findResources';

describe('unit: findResources', () => {
    setupFixturesBase();

    const baseUrl = 'https://example.com/';

    it('extracts JS, CSS, and islands correctly', () => {
        const htmlPath = path.resolve(process.cwd(), 'dist/index.html');
        const result = findResources(htmlPath);

        expect(result.js.length).toBeGreaterThan(0);
        expect(result.js.every(url => url.startsWith('/assets'))).toBe(true);

        expect(result.css.length).toBeGreaterThan(0);
        expect(result.css.every(url => url.startsWith('/assets'))).toBe(true);

        expect(result.islands.Hello.uid).toBe('Z2f1Nmm');
        expect(result.islands.Hello.componentUrl).toBe('/assets/js/Hello-CGVomTcg.js');

        expect(result.islands.World.uid).toBe('UbydA');
        expect(result.islands.World.componentUrl).toBe('/assets/js/World-CWlQCMN_.js');
    });
});
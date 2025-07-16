import {describe, it, expect} from 'vitest';
import {processHtmlFiles} from '../src/processor/processHtmlFiles';
import {setupFixturesBase} from '../src/utils/setupFixturesBase';
import {defaultConfig} from "../src/types";

describe('unit: processHtmlFiles with multiple files in fixtures/dist', () => {
  setupFixturesBase();

  it('processes multiple html files and extracts resources correctly', async () => {
    const files = [
      'dist/index.html',
      'dist/about/index.html',
    ];

    const result = await processHtmlFiles(files, defaultConfig);

    const indexEntry = result['dist/index.html'];
    const aboutEntry = result['dist/about/index.html'];

    expect(indexEntry).toBeDefined();
    expect(aboutEntry).toBeDefined();

    expect(indexEntry.js).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/assets/js/ModuleOne'),
        expect.stringContaining('/assets/js/ModuleTwo'),
        expect.stringContaining('/assets/js/Background'),
        expect.stringContaining('/assets/js/Tabs'),
      ])
    );

    expect(indexEntry.css).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/assets/css/index-mR53M-XZ.css'),
        expect.stringContaining('/assets/css/index-DZ99uc2n.css'),
      ])
    );

    expect(indexEntry.islands).toEqual({
      Hello: expect.objectContaining({
        uid: 'Z2f1Nmm',
        componentUrl: '/assets/js/Hello-CGVomTcg.js',
      }),
      World: expect.objectContaining({
        uid: 'UbydA',
        componentUrl: '/assets/js/World-CWlQCMN_.js',
      }),
    });

    expect(aboutEntry.js).toEqual(
      expect.arrayContaining([
        '/assets/js/Component.astro_astro_type_script_index_0_lang-BQ5VnfyE.js',
        '/assets/js/Layout.astro_astro_type_script_index_0_lang-DvaTEbLM.js',
      ])
    );

    expect(aboutEntry.css).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/assets/css/about-Bf4XAExs.css'),
        expect.stringContaining('/assets/css/Component-DVPBh9ie.css'),
        expect.stringContaining('/assets/css/index-mR53M-XZ.css'),
      ])
    );
  });
});
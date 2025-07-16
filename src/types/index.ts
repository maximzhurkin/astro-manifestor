// noinspection SpellCheckingInspection

import type {Options as PrettierOptions} from 'prettier';

type SafePrettierOptions = Omit<PrettierOptions, 'parser'>;

export interface Island {
  uid: string | null;
  componentUrl: string | null;
  componentExport: string | null;
  rendererUrl: string | null;
  client: string | null;
  props: string | null;
  ssr: string | null;
}

export interface ManifestEntry {
  css: string[];
  js: string[];
  islands: Record<string, Island>;
}

export type ManifestMap = Record<string, ManifestEntry>;

export type Config = {
  /** Корневая директория с HTML-файлами */
  inputDir: string;

  /** Путь и имя выходного файла с манифестом (относительно проекта) */
  manifestOutFile: string;

  /** Абсолютный путь, для сохранения вырезанных inline-скриптов */
  inlineScriptsOutDir: string;

  /** URL-путь, который вставляется в <script src="" */
  inlineScriptsPublicPath: string;

  /** Префикс для файлов инлайн-скриптов */
  inlineScriptPrefix: string;

  /** Подробный вывод логов */
  verbose?: boolean;

  /** Настройки Prettier для форматирования */
  prettierOptions?: SafePrettierOptions;

  /**
   * Функция для трансформации манифеста перед сохранением.
   * Получает объект с ключами и ManifestEntry и возвращает новый объект.
   */
  transformManifest?: (manifestMap: ManifestMap) => ManifestMap | Promise<ManifestMap>;
};

export const defaultConfig: Config = {
  inputDir: 'dist',
  manifestOutFile: 'dist/assets/manifest.json',
  inlineScriptsOutDir: 'dist/assets/js',
  inlineScriptsPublicPath: '/assets/js',
  inlineScriptPrefix: 'inline-script-',
  verbose: false,
  prettierOptions: {
    tabWidth: 4,
    printWidth: 80,
    htmlWhitespaceSensitivity: 'ignore',
  }
}
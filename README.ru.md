# 🌟 astro-manifestor

**astro-manifestor** — CLI-инструмент для генерации manifest-файла и выноса inline-скриптов из HTML, например, после сборки Astro в режиме `static` или других SSG.

- Рекурсивно сканирует HTML-файлы в `dist`
- Извлекает inline-скрипты во внешние `.js`-файлы
- Генерирует `manifest.json`, отображающий зависимости файлов

---

## ❓ Зачем это нужно

Astro и похожие SSG создают HTML, в котором используются:

- ресурсы с динамическими хэшами (скрипты, CSS, изображения)
- inline-скрипты (например, island-компоненты)

При интеграции такой статики в серверные фреймворки типа **Laravel**, **Bitrix**, **Symfony**, где HTML собирается из Blade/Twig/PHP, требуется знать, какие именно ресурсы нужны для каждой страницы, чтобы корректно их подключить.

**astro-manifestor** помогает:

- получить список ресурсов для каждой HTML-страницы
- вынести inline-скрипты во внешние файлы (что удобно для кеширования и CSP)
- упростить интеграцию Astro-статик в монолитные проекты без REST API

---

## 🚀 Быстрый старт

### 1. Использование без установки

```bash
npx astro-manifestor \
  --inputDir ./dist \
  --manifestOutFile ./dist/assets/manifest.json \
  --inlineScriptsOutDir ./dist/assets/js \
  --inlineScriptsPublicPath /assets/js \
  --inlineScriptPrefix inline-script- \
  --verbose
```

```json
{
  "scripts": {
    "build:manifest": "npx astro-manifestor"
  }
}
```

### 2. Или установка как зависимость

```bash
npm install --save-dev astro-manifestor
```

---

## ⚙️ CLI-параметры

| Параметр                    | Описание                                                                |
|-----------------------------|-------------------------------------------------------------------------|
| `--inputDir`                | Путь к директории с HTML-файлами (например, `dist/`)                    |
| `--manifestOutFile`         | Путь к выходному `manifest.json`                                        |
| `--inlineScriptsOutDir`     | Куда складывать вынесенные inline-скрипты                               |
| `--inlineScriptsPublicPath` | Публичный путь (используется в манифесте)                               |
| `--inlineScriptPrefix`      | Префикс имени для inline-скриптов (например, `inline-script-`)          |
| `--verbose`                 | (опц.) Вывод подробной информации                                       |

---

## 🔧 Кастомизация

Используйте файл `astro-manifestor.config.{js,ts}` в корне проекта:

```js
export default {
  inputDir: 'dist',
  manifestOutFile: 'dist/assets/manifest.json',
  inlineScriptsOutDir: 'dist/assets/js',
  inlineScriptsPublicPath: '/assets/js',
  inlineScriptPrefix: 'inline-script-',
  verbose: true,
  prettierOptions: {
    tabWidth: 4,
    printWidth: 80,
    htmlWhitespaceSensitivity: 'ignore',
  },
}
```

### Изменить содержимое манифеста перед его сохранением

```js
export default {
  transformManifest: (manifestMap) => {
    for (const key in manifestMap) {
      const entry = manifestMap[key];

      for (const islandName in entry.islands) {
        const island = entry.islands[islandName];

        if (island.componentUrl) {
          island.componentUrl = 'https://example.com' + island.componentUrl;
        }
      }
    }
    
    return manifestMap;
  },
};
```

👆 Это особенно удобно, если:

- вы перемещаете скрипты после билда
- у вас есть CDN или прокси, меняющий пути
- нужно добавить дополнительные данные в манифест

Файл может быть `.ts` или `.js`. Он автоматически подхватывается CLI.

---

## ✨ Примеры

### Пример выходного манифеста

```json
{
  "dist/index.html": {
    "js": [
      "/assets/js/inline-script-2mu117.js",
      "/assets/js/ModuleOne.astro_astro_type_script_index_0_lang-CTXcsgZ5.js",
      "/assets/js/Layout.astro_astro_type_script_index_0_lang-DvaTEbLM.js"
    ],
    "css": [
      "/assets/css/index-mR53M-XZ.css",
      "/assets/css/chunk-Bj5H1zmF.css"
    ],
    "islands": {
      "Hello": {
        "uid": "Z2f1Nmm",
        "componentUrl": "https://example.com/assets/js/Hello-CGVomTcg.js",
        "componentExport": "default",
        "rendererUrl": "/assets/js/client-dDWe5wvR.js",
        "client": "only",
        "props": "{}",
        "ssr": ""
      }
    }
  },
  "dist/about/index.html": {
    "js": [],
    "css": [],
    "islands": {}
  }
}
```

---

### Пример до / после

#### До:

```html
<body>
  <script type="module" src="/assets/js/component-A.js"></script>
  
  <h1>Hello</h1>
  
  <script>(() => {
    console.log('inline logic');
  })();</script>

  <script type="module" src="/assets/js/component-B.js"></script>
</body>
```

#### После:

```html
<body>
  <h1>Hello</h1>

  <script src="/assets/js/inline-script-abc123.js"></script>
  <script type="module" src="/assets/js/component-A.js"></script>
  <script type="module" src="/assets/js/component-B.js"></script>
</body>
```

✅ **Что происходит:**

* Все `<script>` элементы перемещаются в низ `<body>`
* Инлайновые скрипты сохраняются в отдельные `.js` файлы
* Сохраняется порядок выполнения

---

## 👀 TODO / планы

- [ ] Поддержка CSS inline-стилей

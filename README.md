# 🌟 astro-manifestor

🇷🇺 Документация на русском: [README.ru.md](./README.ru.md)

**astro-manifestor** is a CLI tool that generates a `manifest.json` and extracts inline `<script>` blocks into external files — for example, after building Astro in `static` mode or using another SSG.

* Recursively scans HTML files in `dist`
* Extracts inline scripts into `.js` files
* Generates a `manifest.json` with per-page dependency mapping

---

## ❓ Why you might need this

Astro and similar SSGs produce HTML that includes:

* Dynamically hashed assets (JS, CSS, images)
* Inline scripts (e.g., for island components)

When integrating such static output into server-side frameworks like **Laravel**, **Bitrix**, or **Symfony**, where HTML is composed via Blade/Twig/PHP, you often need to know exactly **which assets each page depends on**.

**astro-manifestor** helps:

* Identify which JS/CSS/islands each page uses
* Move inline scripts into external `.js` files (for CSP and caching)
* Simplify integrating Astro static output into monolithic apps

---

## 🚀 Quick Start

### 1. Use without installing

```bash
npx astro-manifestor \
  --inputDir ./dist \
  --manifestOutFile ./dist/assets/manifest.json \
  --inlineScriptsOutDir ./dist/assets/js \
  --inlineScriptsPublicPath /assets/js \
  --inlineScriptPrefix inline-script- \
  --verbose
```

Or from a `package.json` script:

```json
{
  "scripts": {
    "build:manifest": "npx astro-manifestor"
  }
}
```

### 2. Install as a dev dependency

```bash
npm install --save-dev astro-manifestor
```

---

## ⚙️ CLI Options

| Option                      | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `--inputDir`                | Directory with HTML files (e.g. `dist/`)                   |
| `--manifestOutFile`         | Output path for `manifest.json`                            |
| `--inlineScriptsOutDir`     | Where extracted inline scripts are saved                   |
| `--inlineScriptsPublicPath` | Public path used in manifest                               |
| `--inlineScriptPrefix`      | Prefix for inline script filenames (e.g. `inline-script-`) |
| `--verbose`                 | (optional) Print detailed progress info                    |

---

## 🔧 Customization

Use `astro-manifestor.config.js` or `.ts` in your project root:

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

### Transform the manifest before saving

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

Useful when:

* You move or post-process assets after build
* Using a CDN or proxy that changes paths
* You want to add additional metadata

`.ts` or `.js` config files are supported and loaded automatically.

---

## ✨ Examples

### Example output manifest

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

### HTML before/after

#### Before:

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

#### After:

```html
<body>
  <h1>Hello</h1>

  <script src="/assets/js/inline-script-abc123.js"></script>
  <script type="module" src="/assets/js/component-A.js"></script>
  <script type="module" src="/assets/js/component-B.js"></script>
</body>
```

✅ **What happens:**

* All `<script>` tags are moved to the end of `<body>`
* Inline scripts are extracted into external `.js` files
* Execution order is preserved

---

## 👀 TODO / Roadmap

* [ ] Support for inline CSS extraction

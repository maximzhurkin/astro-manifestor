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

  // пример transformManifest — здесь пользователь может модифицировать манифест перед записью
  transformManifest: (manifestMap) => {
    // например, добавить какой-то префикс к url в islands
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
  }
};
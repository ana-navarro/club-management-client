const swcModule = require('@swc/jest')
const swc = swcModule.default ?? swcModule

// react-router uses import.meta, which does not exist in the CommonJS modules Jest runs.
const withoutImportMeta = (source) => source.replaceAll('import.meta', '({})')

module.exports = {
  createTransformer(options) {
    const transformer = swc.createTransformer(options)
    return {
      ...transformer,
      process: (source, path, config) => transformer.process(withoutImportMeta(source), path, config),
      processAsync: (source, path, config) =>
        transformer.processAsync(withoutImportMeta(source), path, config),
    }
  },
}

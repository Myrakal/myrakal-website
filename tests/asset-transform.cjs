const { basename } = require('node:path')

module.exports = {
  process(_src, filename) {
    return { code: `module.exports = { __esModule: true, default: { src: '/${basename(filename)}', width: 1, height: 1 } }` }
  },
}

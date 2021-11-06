const fs = require('fs');
const path = require('path');

function virtualExamplePlugin() {
  const virtualFileId = '@example.json';

  const exampleDir = path.join(__dirname, '../../examples');
  const examples = [];

  function walk(dirOrFile, frags) {
    if (fs.statSync(dirOrFile).isDirectory()) {
      for (const subDir of fs.readdirSync(dirOrFile)) {
        walk(path.join(dirOrFile, subDir), frags.concat(subDir));
      }
    } else {
      if (path.extname(dirOrFile) !== '.json') {
        return;
      }
      const value = JSON.parse(fs.readFileSync(dirOrFile, 'utf-8'));
      const name = frags.join('/');
      examples.push({ name, value });
    }
  }

  walk(exampleDir, []);

  return {
    name: 'virtual-example-plugin',
    resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId;
      }
    },
    load(id) {
      if (id === virtualFileId) {
        return JSON.stringify(examples);
      }
    },
  };
}

module.exports = {
  virtualExamplePlugin,
};

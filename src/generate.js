const pug = require('pug');
const path = require('path');
const fs = require('fs-extra');

const OUTPUT_DIR = path.resolve(__dirname, '../_site');

// All html written to $ROOT/_site
function writeHTML2File(filename, html) {
  fs.writeFileSync(`${OUTPUT_DIR}/${filename}`, html);
}

// Copy folder from src root src directory to _site/dest
function copyFolderToSite(src, dest) {
  fs.copySync(path.resolve(__dirname, src), path.resolve(OUTPUT_DIR, dest));
}

const copyStyles = copyFolderToSite.bind(null, 'styles', 'styles');

// expects the name to be in the form of page.pug
function renderPugPage(pageName, locals = {}) {
  let renderedHTML = pug.renderFile(path.resolve(__dirname, 'pages', pageName), Object.assign({pretty: true, locals}));
  writeHTML2File(`${pageName.split('.')[0]}.html`, renderedHTML);
}

function generate() {
  fs.ensureDirSync(OUTPUT_DIR);
  copyStyles();

  renderPugPage('index.pug');
}

generate();
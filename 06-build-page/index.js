const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const projectPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const copiedAssetsPath = path.join(projectPath, 'assets');
const destinationStylesFile = path.join(__dirname, 'project-dist', 'style.css');


async function createStylesBundle(stylesFolder) {
  const styleFiles = await fsPromises.readdir(stylesFolder, { withFileTypes: true });
  const writeStream = fs.createWriteStream(destinationStylesFile);
  styleFiles.forEach((file) => {
    let filePath = path.join(stylesFolder, file.name);
    if (!file.isDirectory() && file.isFile() && path.extname(filePath) === '.css') {
      const readStream = fs.createReadStream(filePath, 'utf-8');
      let result = '';
      readStream.on('data', chunk => result += chunk);
      readStream.on('end', () => writeStream.write(`${result}\n`));
      readStream.on('error', err => console.log('Error: ', err.message));
    }
  });
}

async function copyAssetsDir(mainPath, copiedPath) {
  await fsPromises.mkdir(copiedPath, { recursive: true });
  const folderItems = await fsPromises.readdir(mainPath, { withFileTypes: true });
  folderItems.forEach((item) => {
    if (item.isFile()) {
      fsPromises.copyFile(path.join(mainPath, item.name), path.join(copiedPath, item.name));
    }
    if (item.isDirectory()) {
      copyAssetsDir(path.join(mainPath, item.name), path.join(copiedPath, item.name));
    }
  });
}

(async function buildPage() {
  await fsPromises.rm(projectPath, { force: true, recursive: true });
  await fsPromises.mkdir(projectPath);
  // buildHtml();
  createStylesBundle(stylesPath);
  copyAssetsDir(assetsFolderPath, copiedAssetsPath);
})();
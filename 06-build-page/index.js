const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const stylesPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const templateHTMLpath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const projectPath = path.join(__dirname, 'project-dist');
const copiedAssetsPath = path.join(projectPath, 'assets');
const destinationStylesFile = path.join(projectPath, 'style.css');
const newHTMLFilePath = path.join(projectPath, 'index.html');


async function buildHTMLfile() {
  let htmlFileData = await fsPromises.readFile(templateHTMLpath, { encoding: 'utf-8' });
  let componentsFiles = (await fsPromises.readdir(componentsPath, { withFileTypes: true }))
    .filter((item) => !item.isDirectory() && path.extname(item.name) === '.html');
  let matchesArray = Array.from(htmlFileData.matchAll(/{{(\w+)}}/g));
  const templatesArray = matchesArray.map((item)=>item[0]);
  const templateNamesArray = matchesArray.map((item)=>item[1]);
  // console.log('templatesArray:  ',templatesArray);
  // console.log('templatesArray:  ',templateNamesArray);
  // console.log('componentsFiles:  ', componentsFiles);
  componentsFiles.forEach(async (componentFile) => {
    const filePath = path.join(componentsPath, componentFile.name);
    const fileName = componentFile.name.replace(/\.\w+/,'');
    if(templateNamesArray.includes(fileName)) {
      let index = templateNamesArray.indexOf(fileName);
      let componentData  = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
      htmlFileData = htmlFileData.replaceAll(templatesArray[index], componentData);
      await fsPromises.writeFile(newHTMLFilePath, htmlFileData);
    }
  });
}


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
  buildHTMLfile();
  createStylesBundle(stylesPath);
  copyAssetsDir(assetsFolderPath, copiedAssetsPath);
})();
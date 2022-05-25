const fs = require('fs/promises');
const {createReadStream, createWriteStream} = require('fs');
const path = require('path');

const sourceDirectory = path.join(__dirname, 'styles');
const destinationFile = path.join(__dirname, 'project-dist', 'bundle.css');

(async function createBundle(stylesFolder) {
  const styleFiles = await fs.readdir(stylesFolder, {withFileTypes: true});
  const writeStream = createWriteStream(destinationFile);
  styleFiles.forEach((file)=>{
    let filePath = path.join(stylesFolder, file.name);
    if (!file.isDirectory() && file.isFile() && path.extname(filePath) === '.css') {
      const readStream = createReadStream(filePath, 'utf-8');
      let result = '';
      readStream.on('data', chunk => result += chunk);
      readStream.on('end', () => writeStream.write(`${result}\n`));
      readStream.on('error', err => console.log('Error: ', err.message));      
    }   
  });
})(sourceDirectory);

//!оставляйте пожалуйста контакт для обратной связи) telegram: @ithinkiwinaloto; 
//! discord theroofisonfire#1523 (NikolayKovzik)
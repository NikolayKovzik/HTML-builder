const fs = require('fs/promises');
const path = require('path');
const mainFolderPath = path.join(__dirname, 'files');
const copiedFolderPath = path.join(__dirname, 'files-copy');

(async function checkFolderExistence(){
  await fs.access(copiedFolderPath);
  await fs.rm(copiedFolderPath, { recursive: true });
  copyDir(mainFolderPath, copiedFolderPath);
})().catch((error)=>{
  if(error.code === 'ENOENT') {
    copyDir(mainFolderPath, copiedFolderPath);
  } else {
    console.log(`Error: ${error}`);
  }
});


async function copyDir(mainPath, copiedPath) {
  await fs.mkdir(copiedPath, { recursive: true });
  const files = await fs.readdir(mainPath, { withFileTypes: true });
  files.forEach((file)=>{
    fs.copyFile(path.join(mainPath,file.name), path.join(copiedPath,file.name));
  });
}

//!оставляйте пожалуйста контакт для обратной связи) telegram: @ithinkiwinaloto; 
//! discord theroofisonfire#1523 (NikolayKovzik)



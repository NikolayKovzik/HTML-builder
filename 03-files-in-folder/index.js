const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log('Error: ', err.message);
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        let fileInfo = `${file.name.split('.').join(' --- ')}`;
        fs.stat(path.join(folderPath, `${file.name}`), (err, stats) => { console.log(`${fileInfo} --- ${(stats.size / 1024).toFixed(3)}kb`); });
      }
    });
  }
});
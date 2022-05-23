// !using fs

// const fs = require('fs');
// fs.readFile('./01-read-file/text.txt','utf-8',(err, data)=>{
//     console.log(data);
// })


const path = require('path');
const fs = require('fs');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));
stream.on('error', err => console.log('Error: ', err.message));



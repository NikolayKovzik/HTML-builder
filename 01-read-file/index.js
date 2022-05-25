// !using readFile

// const fs = require('fs');
// fs.readFile('./01-read-file/text.txt','utf-8',(err, data)=>{
//     console.log(data);
// })


const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const fs = require('fs');
const readStream = fs.createReadStream(filePath, 'utf-8');
let data = '';

readStream.on('data', chunk => data += chunk);
readStream.on('end', () => console.log(data));
readStream.on('error', err => console.log('Error: ', err.message));


//!оставляйте пожалуйста контакт для обратной связи) telegram: @ithinkiwinaloto; 
//! discord theroofisonfire#1523 (NikolayKovzik)



const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);
const { stdout, stdin } = require('process');

stdout.write('Enter text: ');

stdin.on('data', (data) => {
  if (data.toString().trim() !== 'exit') {
    writeStream.write(data.toString());
  } else {
    stdout.write('Goodbye!');
    process.exit();
  }
});

process.on('SIGINT', () => {
  stdout.write('Goodbye!');
  process.exit();
});

//!Работа не доделана, буду очень признателен, если вы проверите её в четверг, спасибо!
//!Если проверяете, оставляйте пожалуйста контакт для обратной связи) telegram: @ithinkiwinaloto; 
//! discord theroofisonfire#1523 (NikolayKovzik)
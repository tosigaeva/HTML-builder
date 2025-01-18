const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');
const steam = fs.createReadStream(pathToFile, { encoding: 'utf-8' });

steam.on('data', (chunk) => {
  process.stdout.write(chunk);
});
steam.on('error', (err) => console.log('Error', err.message));

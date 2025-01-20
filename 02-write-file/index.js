const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const stream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Please enter some text. Type "exit" or press Ctr+C to quit.');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Goodbye!');
    rl.close();
    process.exit(0);
  } else {
    stream.write(`${input}\n`);
  }
});

rl.on('SIGINT', () => {
  console.log('Goodbye!');
  rl.close();
  process.exit(0);
});

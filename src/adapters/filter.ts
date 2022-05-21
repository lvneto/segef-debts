import * as fs from 'fs';
import * as  readline from 'readline';
import * as path from 'path';
import {v1 as uuidv4} from 'uuid';

const EXTENSION = '.txt';

function filter(inputFile: any,outputFile: any) {
  const readStream = fs.createReadStream(inputFile);
  const writeStream = fs.createWriteStream(outputFile);

  writeStream.on('error', (error) => {
    console.log(`An error occured while writing to the file. Error: ${error.message}`);
  });

  const stream = readline.createInterface({
    input: readStream,
    output: writeStream
  });

  stream.on('line', (line: any) => {
    switch (line.trim()) {
      case 'exit':
        stream.close();
        break;
      default:
        line = line.replace(/\s\s+/g,'#');
        line = line.replaceAll(',','$');               
        writeStream.write(`${line}\n`);
        break;
    }
  }).on('close', () => {
    writeStream.end();
    writeStream.on('finish', () => {
      console.log('done.');
    })
    setTimeout(() => {
      process.exit(0);
    }, 100);
  });
} 

const files = fs.readdirSync(__dirname);

const jsFiles = files.filter(function (file) {
  return path.extname(file) === ".txt";
});

for (const file of jsFiles) {
  filter(file, `${uuidv4()}.csv`);
}
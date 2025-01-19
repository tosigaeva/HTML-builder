const fs = require('fs/promises');
const path = require('path');

const pathToDir = path.join(__dirname, 'secret-folder');
fs.readdir(pathToDir, { withFileTypes: true })
  .then((files) => {
    for (let file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToDir, file.name);
        fs.stat(pathToFile)
          .then((stats) => {
            const fileName = path.basename(
              pathToFile,
              path.extname(pathToFile),
            );
            const fileExt = path.extname(pathToFile).slice(1);
            const fileSize = (stats.size / 1024).toFixed(3);

            console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  })
  .catch((error) => {
    console.log(error);
  });

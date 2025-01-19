const fs = require('fs/promises');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

(async () => {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(stylesDir, { withFileTypes: true });
    const cssPromises = [];

    for (let file of files) {
      const filePath = path.join(stylesDir, file.name);
      const fileExt = path.extname(filePath);

      if (file.isFile() && fileExt === '.css') {
        cssPromises.push(fs.readFile(filePath, { encoding: 'utf-8' }));
      }
    }
    const cssContent = await Promise.all(cssPromises);
    const combinedContent = cssContent.join('\n');
    await fs.writeFile(outputFile, combinedContent, { encoding: 'utf-8' });
  } catch (error) {
    console.error('Error:', error);
  }
})();

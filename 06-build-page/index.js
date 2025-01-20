const fs = require('fs/promises');
const path = require('path');

(async () => {
  try {
    const projectDist = path.join(__dirname, 'project-dist');
    const templatePath = path.join(__dirname, 'template.html');
    const componentsPath = path.join(__dirname, 'components');
    const assetsPats = path.join(__dirname, 'assets');
    const stylesPath = path.join(__dirname, 'styles');
    const outputHtmlPath = path.join(projectDist, 'index.html');
    const outputCssPath = path.join(projectDist, 'style.css');
    const outputAssetsPath = path.join(projectDist, 'assets');

    await fs.mkdir(projectDist, { recursive: true });

    let templateContent = await fs.readFile(templatePath, {
      encoding: 'utf-8',
    });
    const templateTags = templateContent.match(/{{\s*[\w-]+\s*}}/g) || [];

    for (let tag of templateTags) {
      const componentName = tag.replace(/{{\s*|\s*}}/g, '');
      const componentPath = path.join(componentsPath, `${componentName}.html`);
      const componentContent = await fs.readFile(componentPath, {
        encoding: 'utf-8',
      });
      templateContent = templateContent.replace(
        new RegExp(tag, 'g'),
        componentContent,
      );
    }

    await fs.writeFile(outputHtmlPath, templateContent);

    const styleFiles = await fs.readdir(stylesPath, { withFileTypes: true });
    const cssChunks = [];

    for (let file of styleFiles) {
      const filePath = path.join(stylesPath, file.name);

      if (file.isFile() && path.extname(filePath) === '.css') {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        cssChunks.push(fileContent);
      }
    }

    await fs.writeFile(outputCssPath, cssChunks.join('\n'));
    await copyDir(assetsPats, outputAssetsPath);
  } catch (error) {
    console.error('Error: ', error);
  }
})();

async function copyDir(src, dest) {
  try {
    await fs.rm(dest, { recursive: true, force: true });
    await fs.mkdir(dest, { recursive: true });

    const items = await fs.readdir(src, { withFileTypes: true });

    for (let item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

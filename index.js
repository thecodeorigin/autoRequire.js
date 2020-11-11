var fs = require('fs'), path = require('path')
  
async function getFilesAsync(path = "./") {
  const entries = await fs.promises.readdir(path, { withFileTypes: true });
  const files = entries
      .filter(file => !file.isDirectory())
      .map(file => ({ name: file.name, path: path + file.name }));
  const folders = entries.filter(folder => folder.isDirectory());
  for (const folder of folders) {
    files.push(...await getFilesAsync(`${path}${folder.name}/`));
  }
  return files
}

function getDirectoryTree(folderPath) {
  var stats = fs.lstatSync(folderPath),
      info = {
          path: folderPath,
          name: path.basename(folderPath)
      };
  if (stats.isDirectory()) {
      info.type = "folder";
      info.children = fs.readdirSync(folderPath).map(function(child) {
          return getDirectoryTree(folderPath + '/' + child);
      });
  } else {
      info.type = "file";
  }
  return info;
}

function requireAuto(folderPath) {
  var info = {}
  if (fs.lstatSync(folderPath).isDirectory()) {
    Object.values(fs.readdirSync(folderPath)).forEach(child => {
      var key = child.includes('.') ? child.split('.')[0] : child
      info[key] = requireAuto(folderPath + '/' + child)
    })
  } else {
    info = require(folderPath)
  }
  return info;
}

// Example:
// Just console.log around, it's simple as it looks
// Promise.resolve(getFilesAsync('./folder1/')).then(result => console.log(result))
// console.log(getDirectoryTree('./folder1/'))
// console.log(requireAuto('./folder1/'))

// Using ES6 module
var something = {}
const requireModule = require.context('./', true, /\.js$/)
requireModule.keys().forEach(requireModule)
requireModule.keys().forEach((fileName) => {
  if (!fileName.includes('index.js')) {
    const temp = fileName.replace(/(\.\/|\.js$)/g, '').split('/')
    const moduleName = temp.length > 1 ? temp[temp.length - 2] : temp[0]
    something[moduleName] = requireModule(fileName).default
  }
})

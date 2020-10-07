// Directory:
// folder1
// --folder2
// ----somefile1.js
// ----somefile2.js
// --folder3
// ----somefile3.js
// ----somefile4.json
// Goal:
// Achieve an object like so :
// {
//   folder2: {
//     somefile1: {
//       somefunction: [Function aFunction] // You can call this function if you require it
//     },
//     somefile2: {},
//   },
//   folder3: {
//     somefile3: {},
//     somefile4: {
//        something: "Something in the json file"
//     },
//   }
// }

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

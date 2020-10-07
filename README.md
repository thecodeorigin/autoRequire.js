# autoRequire.js
Some helper function that can help you requiring all files in a directory (inspired by nuxt.js). Also it can help you retrieve the directory tree

```
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
```

var fs = require('fs');
var Promise = require('promise');
var debug = require('debug')('repo-copy:lib');
var _path = require('path');
var ignore = require('ignore');
var glob = require('glob');
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');
var mkdirPromise = Promise.denodeify(fs.mkdir);

module.exports = {
  isGitRepo: (path) => {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stat) => {
        if (err){
          reject(err);
        }else{
          resolve(stat.isDirectory());
        }
      });
    });
  },
  getFiles: (path) => {
    return new Promise((resolve, reject) => {
      var ig = ignore().addIgnoreFile(_path.resolve(path, '..', '.gitignore'));
      glob('**', {
        cwd: _path.resolve(path, '..')
      }, (err, files) => {
        var filtered;

        if (err) {
            reject(err);
        } else {
            resolve(ig.filter(files));
        }
      });
    });
  },
  createCopy: (base, files, tempPath) => {
    var proms = [];
    //Add the promise to create the temp folder
    proms.push(mkdirPromise(tempPath));

    //add all the promises that copy the files
    files.forEach((file) => {
      proms.push(copyFile(_path.resolve(base, file), _path.resolve(tempPath, file)));
    });

    //add the promise to return the temp folder
    proms.push(Promise.resolve(tempPath));

    //return the result of all promises
    return Promise.all(proms)
  },
  createTarGz: (tempPath, destination) => {

    fstream.Reader({ path: tempPath, type: 'Directory' }) /* Read the source directory */
    .pipe(tar.Pack()) /* Convert the directory to a .tar file */
    .pipe(zlib.Gzip()) /* Compress the .tar file */
    .pipe(fstream.Writer({ path: destination })); /* Give the output file name */

  }
};

function copyFile(source, target){
  return new Promise((resolve, reject) => {
    fs.stat(source, (err, stat) => {
      if (err){
        reject(err);
      }else{
        if (stat.isDirectory()){
          fs.mkdir(target, (err) => {
            if (err){
              reject(err);
            }else{
              resolve();
            }
          })
        }else {
          var rd = fs.createReadStream(source);
          rd.on("error", function(err) {
            reject(err);
          });
          var wr = fs.createWriteStream(target);
          wr.on("error", function(err) {
            reject(err);
          });
          wr.on("close", function(ex) {
            resolve();
          });
          rd.pipe(wr);
        }
      }
    });
  });
}

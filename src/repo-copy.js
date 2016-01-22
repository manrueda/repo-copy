
var fs = require('fs');
var Promise = require('promise');
var debug = require('debug')('repo-copy:lib');
var _path = require('path');
var ignore = require('ignore');
var glob = require('glob');
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');
var AdmZip = require('adm-zip');
var mkdirPromise = Promise.denodeify(fs.mkdir);

module.exports = {
  validateProgram: (program) => {
    if (program.copy){
      if (program.args.length === 0)
        return new Error('Need to provide a repository path');
      try {
        var stat = fs.statAsync(program.out);
        if (!stat.isDirectory()){
          return new Error('The output must be a folder');
        }
      } catch (e) {
        return new Error('The output folder can\'t be founded');
      }
    }else if (program.compress){
      if (program.args.length === 0)
        return new Error('Need to provide a repository path');
    }else{
      return false;
    }
    return true;
  },
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
    proms.push(() => {
      return mkdirPromise(tempPath);
    });

    //add all the promises that copy the files
    files.forEach((file) => {
      proms.push(copyFile(_path.resolve(base, file), _path.resolve(tempPath, file)));
    });

    //add the promise to return the temp folder
    proms.push(() => {
      return Promise.resolve(tempPath);
    });

    //return the result of all promises
    return proms.reduce((cur, next) => {
      return cur.then(() =>{
        return next();
      });
    }, Promise.resolve());
  },
  createTarGzip: (tempPath, destination) => {

    fstream.Reader({ path: tempPath, type: 'Directory' }) /* Read the source directory */
    .pipe(tar.Pack()) /* Convert the directory to a .tar file */
    .pipe(zlib.Gzip()) /* Compress the .tar file */
    .pipe(fstream.Writer({ path: destination })); /* Give the output file name */

  },
  createZip: (tempPath, destination) => {
    var zip = new AdmZip();

  	zip.addLocalFolder(tempPath);
  	// or write everything to disk
  	zip.writeZip(destination);
  }
};

function copyFile(source, target){
  return () => {
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
  };
}

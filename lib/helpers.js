const fs = require('fs');
const _ = require('lodash');

function readFile(file_name) {
  return new Promise((resolve, reject) => {
    fs.readFile(file_name, 'utf-8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

function writeFile(file_name, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file_name, data, 'utf-8', (err) => {
      err ? reject(err) : resolve(file_name);
    });
  });
}

function appendFile(file_name, data = false, stream = false) {
  return new Promise((resolve, reject) => {
    if (stream) {
      resolve(fs.createWriteStream(file_name, {flags:'a'}));
    }
    else {
      fs.appendFile(file_name, data, (err) => {
        err ? reject(err) : resolve('Done!');
      });
    }
  });
}

function prepareFile(file_name) {
  return {
    local: `${process.cwd()}/${file_name}`,
    file: file_name
  };
}

function buildFileList(file, files) {
  return new Promise((resolve, reject) => {
    if (!file && !files) {
      reject('No file');
    }

    const list = [];

    if (file) {
      list.push(prepareFile(file));
    }

    _.each(files, f => list.push(prepareFile(f)));

    resolve(list);

  });
}

module.exports = {
  file:{
    read: readFile,
    write: writeFile,
    append: appendFile,
    prepare: prepareFile,
    build: buildFileList,
  },
};
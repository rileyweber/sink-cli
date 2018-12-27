const child = require('child_process');
const _ = require('lodash');

const help = require('./helpers');

class Git {
  constructor(status) {
    this.status = status.toUpperCase();
  }

  sink(service, root) {
    this
      .readFiles()
      .then(lines => {
        const mapped = this.mapLines(lines);

        help.file
          .build('', mapped[this.status])
          .then(res => {
            service.sendFiles(res, root);
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch(err => {
        console.log(err);
      });
  }

  readFiles() {
    const s = child.spawn('git', ['status', '--porcelain']);

    return new Promise((resolve, reject) => {
      s.stdout.on('data', data => {
        data = data.toString();

        const lines = this.parseLines(data);

        if (lines) {          
          resolve(lines);
        }
        else {
          reject('No lines');
        }
      });
    });
  }

  parseLines(data) {
    let lines = data.split(/\r?\n/);
    let all = [];

    _.each(lines, line => {
      line = line.trim();

      if (!line) return;

      const parts = _.words(line, /[^ ]+/g);

      all.push({status: parts[0], file: parts[1]});
    });

    return all;
  }

  mapLines(lines) {
    const mapped = {};

    _.each(lines, l => {
      typeof mapped[l.status] === 'object' ? mapped[l.status].push(l.file) : mapped[l.status] = [l.file];
    });

    return mapped;
  }
}

module.exports = Git;

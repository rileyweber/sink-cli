const node_ssh = require('node-ssh');
const { spawn } = require('child_process');
// const fs = require('fs');
// const path = require('path');
const os = require('os');
const _ = require('lodash');

const ssh = new node_ssh();

class Service {
  constructor({host, username}) {
    this.host = host;
    this.username = username;
    this.key = `${os.homedir()}/.ssh/id_rsa`;
  }

  testConnection() {
    ssh
      .connect({
        host: this.host,
        username: this.username,
        privateKey: this.key
      })
      .then(() => {
        ssh
          .execCommand('echo Hello')
          .then((result) => {
            ssh.dispose();

            if (result.stdout) {
              console.log('Host is up!');
            }

          })
          .catch((err) => {
            console.log(err);
          });

      })
      .catch( (err) => {
        console.log(err);
      });
  }

  sendFiles(files, root) {
    let action = `${this.username}@${this.host}:`;
    const send = _.map(files, e => {
      return {local: e.local, remote: `${root}${e.file}`, file: e.file};
    });

    console.log(`Beginning sink on ${send.length} file${send.length == 1 ? '' : 's'}`);

    _.each(send, e => {
      // Sink the file
      const command = `${action}${e.remote}`;

      const s = spawn('rsync', ['-av', e.local, command]);

      s.on('close', code => {
        console.log(`${e.file} : Done!`);
      });
    });
  }
}

module.exports = Service;

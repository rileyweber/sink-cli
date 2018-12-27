const fs = require('fs');
const inquirer = require('inquirer');
const _ = require('lodash');

const helpers = require('./helpers');

const CONFIG_NAME = '.sink-config.json';

const questions = [
  { type: 'input', name: 'project_name', message: 'Give a name to your project:' },
  { type: 'confirm', name: 'correct_path', message: `Is this the root of your local project? If not, cancel out, cd to to the root, and start over.` },
  { type: 'input', name: 'username', message: 'Enter your sandbox username: ' },
  { type: 'input', name: 'env', message: 'Enter your sandbox environment (ie "nodejs" or "php"): ' },
  { type: 'input', name: 'node', message: 'If this is a nodejs project, what node service? ' },
  { type: 'input', name: 'root', message: 'Enter the remote root directory files should be synced to (ie /var/www/Common): ' }
];

class Config {
  constructor(config) {
    this.config = config.config;
    this.history = config.history;
    this.name = config.name;
    this.tracked_files = config.tracked_files;
  }

  print(data = false) {
    if (!data) {
      console.log(JSON.stringify(this.config, undefined, 2));
    }
    else {
      console.log(JSON.stringify(data, undefined, 2));
    }
  }

  trackFiles(files) {
    if (!files.file) {
      console.log('No file to track');

      return false;
    }

    let changes = 0;
    const cwd = process.cwd();

    // if (!this.tracked_files.includes(files.file)) {
    //   // let f = `${cwd}/${files.file}`;
    //   this.tracked_files.push(helpers.prepareFile(files.file));
    //   changes++;
    // }

    // files.files.forEach(e => {
    //   if (!this.tracked_files.includes(e)) {
    //     // let f = `${cwd}/${e}`;
    //     this.tracked_files.push(helpers.prepareFile(e));
    //     changes++;
    //   }
    // });

    const tracked = _.map(this.tracked_files, e => e.local);
    helpers.file
      .build(files.file, files.files)
      .then(res => {
        _.each(res, f => {
          if (!tracked.includes(f.local)) {
            this.tracked_files.push(f);
            changes++;
          }
        });

        if (changes) {
          this
            .save()
            .then(res => {
              console.log('Files tracked!');
            })
            .catch(err => {
              console.log('Error tracking files...');
            });
        }
        else {
          console.log('No new files to track');
        }
      })
      .catch(err => {
        console.log(err);
      });


    // _.each(helpers.file.build(files.file, files.files), f => {
    //   if (!tracked.includes(f.local)) {
    //     this.tracked_files.push(f);
    //     changes++;
    //   }
    // });

    // if (changes) {
    //   this
    //     .save()
    //     .then(res => {
    //       console.log('Files tracked!');
    //     })
    //     .catch(err => {
    //       console.log('Error tracking files...');
    //     });
    //   }
    //   else {
    //     console.log('No new files to track');
    //   }
  }

  viewTracked() {
    this.print(this.tracked_files);
  }

  save() {
    let config = {
      name: this.name,
      config: this.config,
      history: this.history,
      tracked_files: this.tracked_files
    };


    return new Promise((resolve, reject) => {
      Config
        .findConfig(process.cwd())
        .then(res => {
          helpers.file
            .write(res, JSON.stringify(config))
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
    
  }

  static initProject() {
    return new Promise((resolve, reject) => {
      Config.findConfig(process.cwd())
        .then(res => {
          helpers.file
            .read(res)
            .then(data => {
              data = JSON.parse(data);

              const config = {};
              config.config = {};

              config.config.username      = data.config.username;
              config.config.root          = data.config.root;
              config.config.node_service  = data.config.node_service;
              config.config.url           = data.config.url;
              config.history       = data.history;
              config.name          = data.name;
              config.tracked_files = data.tracked_files;

              resolve(config);
            })
            .catch(err => {
              reject(err);
            })
        })
        .catch(err => {
          reject(err);
        });

    });
  }

  static create() {
    inquirer
      .prompt(questions)
      .then((answers) => {
        let config = {
          config: {},
          history: [],
          name: '',
          tracked_files: [],
        };

        answers.root = answers.root.substr(-1) === '/' ? answers.root : `${answers.root}/`;

        config.name = answers.name;
        config.config.username = answers.username;
        config.config.root = answers.root;
        config.config.node_service = answers.node;
        config.config.environment = answers.env;
        config.config.url = `${answers.env}.${answers.username}.dev.use1.amz.mtmetest.com`;

        let string = JSON.stringify(config);

        helpers.file
          .write(`${process.cwd()}/${CONFIG_NAME}`, string)
          .then(res => {
            console.log('Config created!');
            helpers.file
              .append(`${process.cwd()}/.gitignore`, CONFIG_NAME)
              .then(res => {})
              .catch(err => {});
          })
          .catch(err => {
            console.log(err);
          });
        // fs
        //   .writeFile(`${process.cwd()}/${CONFIG_NAME}`, string, 'utf-8', (err) => {
        //     if (err) console.log('There was an error');

        //     console.log('Config created!');
        //   });

      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findConfig(path) {
    const search = (path) => {
      if (!path) {
        return false;
      }

      let files = fs.readdirSync(path);

      if (files && files.includes(CONFIG_NAME)) {
        return `${path}/${CONFIG_NAME}`;
      }

      return search(path.split('/').slice(0, -1).join('/'));
    };

    return new Promise((resolve, reject) => {
      const result = search(path);

      result ? resolve(result) : reject('Config not found');
    });
  }

}

module.exports = Config;
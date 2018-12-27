const Config = require('./config');
const Service = require('./service');
const help = require('./helpers');
const Git = require('./git');

class Dispatch {

  static dispatch(params) {
    Config
      .initProject()
      .then(res => {
        switch (params.class) {
          case 'config':
            Dispatch.config(res, params);
            break;
          case 'service':
            Dispatch.service(res, params);
          case 'git':
            Dispatch.git(res, params);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  static config(data, params) {
    const config = new Config(data);

    switch (params.method) {
      case 'print':
        config.print();
        break;

      case 'track':
        config.trackFiles(params.params);
        break;

      case 'view_tracked':
        config.viewTracked();
        break;
    }
  }

  static service(data, params) {
    const service = new Service({host: data.config.url, username: data.config.username});

    switch (params.method) {
      case 'test_connection':
        service.testConnection();
        break;

      case 'sink_tracked':
        service.sendFiles(data.tracked_files, data.config.root);

      case 'sink_files':
        help.file
          .build(params.params.file, params.params.files)
          .then(res => {
            service.sendFiles(res, data.config.root);
          })
          .catch(err => {
            console.log(err);
          });
    }
  }

  static git(data, params) {
    const service = new Service({host: data.config.url, username: data.config.username});
    const git = new Git(params.status);

    switch (params.method) {
      case 'sink':
        git.sink(service, data.config.root);
        break;
    }
  }
}

module.exports = Dispatch;
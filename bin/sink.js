#!/usr/bin/env node

const commander = require('commander');

const Service = require('../lib/service');
const Config = require('../lib/config');
const Dispatch = require('../lib/dispatch');

// let service = new Service({host: 'php.rweber.dev.use1.amz.mtmetest.com', username: 'rweber'});

// let config = new Config();

// service.testConnection();

commander
  .command('project', 'Entry point for various project tasks');

commander
  .command('track <file> [files...]')
  .description('Add files to your list of tracked files to make syncing easier')
  .action((file, files) => {
    const params = {
      class: 'config',
      method: 'track',
      params: {
        file: file,
        files: files
      }
    };

    Dispatch.dispatch(params);
  });

commander
  .command('tracked')
  .description('Syncs all tracked files')
  .action(() => {
    Dispatch.dispatch({class: 'service', method: 'sink_tracked'});
  });

commander
  .command('files <file> [files...]')
  .description('Syncs the speified files')
  .action((file, files) => {
    const params = {
      class: 'service',
      method: 'sink_files',
      params: {
        file: file,
        files: files,
      }
    };

    Dispatch.dispatch(params);
  });

commander
  .command('git')
  .description('Sync files tracked by Git')
  .option('-s, --status <status>', 'The status of the file (a for added, m for modified)')
  .action((cmd) => {
    const params = {
      class: 'git',
      method: 'sink',
      status: cmd.status
    };

    Dispatch.dispatch(params);
  });


commander.parse(process.argv);

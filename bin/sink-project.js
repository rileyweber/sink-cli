#!/usr/bin/env node --harmony

const program = require('commander');
// const util = require('util');

const Service = require('../lib/service');
const Config = require('../lib/config');
const Dispatch = require('../lib/dispatch');

program
  .command('create')
  .description('Creates a new project')
  .action(() => {
    Config.create();
  });

program
  .command('info')
  .description('Display project config info')
  .action(() => {
    const params = {
      class: 'config',
      method: 'print'
    }

    Dispatch.dispatch(params);
  });

program
  .command('tracked')
  .description('View tracked files')
  .action(() => {
    Dispatch.dispatch({class: 'config', method: 'view_tracked'});
  });

program
  .command('service')
  .description('Checks the reachability of the service')
  .action(() => {
    Dispatch.dispatch({class: 'service', method: 'test_connection'});
  })

program.parse(process.argv);
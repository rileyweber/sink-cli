## Sink CLI

Sink is a project-based tool that helps ease the burden of syncing files to remote sandbox environments.

### Installation

For now, clone this repository. `cd` into the cloned directory and run
`npm install -g ./`

### Usage

The first step is to create a project:
`sink project create`

This will guide you through the process of setting up your project. This command be ran from the root of your project directory otherwise it will not work.


Once you've set up your project, run `sink project info` to make sure it is set up properly. This will display the configuration for your project.

Sinking files can be done three different ways:

1. Via tracked files:
  * First, track files with `sink track <file> [other files...]` This adds files to your configuration that
  * Run `sink tracked` to sync any files that you've tracked.

2. Via Git
  * This option does not work for untracked files
  * Run `sink git --status <git status>` where `git status` is either m for modified, or a for added. `--status` can be replace with `-s`

3. Via the files command
  * `sink files <file> [other files]` 
  * You can use this command to sync as many files as you want


To view full usage and explanations for commands:

1. `sink help`
2. `sink -h` or `sink project --help`
3. `sink project help`
4. `sink project -h` or `sink project --help`


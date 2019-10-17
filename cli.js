#!/usr/bin/env node
const path = require('path');
const sao = require('sao');
const cac = require('cac');
const chalk = require('chalk');
const { version } = require('./package.json');

const generator = path.resolve(__dirname, './');

const cli = cac('create-nuxt-app');

cli.command('[out-dir]', 'Generate in a custom directory or current directory')
    .option('--answers <json>', 'Skip all the prompts and use the provided answers')
    .option('--verbose', 'Show debug logs')
    .action((outDir = '.', cliOptions) => {
        console.log();
        console.log(chalk`{cyan create-nuxt-app v${version}}`);
        console.log(chalk`✨  Generating Nuxt.js project in {cyan ${outDir}}`);

        const { verbose, answers } = cliOptions;
        const logLevel = verbose ? 4 : 2;
        // See https://saojs.org/api.html#standalone-cli
        sao({ generator, outDir, logLevel, answers, cliOptions })
            .run()
            .catch(err => {
                console.trace(err);
                process.exit(1);
            });
    });

cli.help();

cli.version(version);

cli.parse();

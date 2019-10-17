const { relative } = require('path');
const spawn = require('cross-spawn');
const validate = require('validate-npm-package-name');

module.exports = {
    prompts: require('./prompts'),
    templateData() {
        const cms = this.answers.cms;
        const pwa = this.answers.features.includes('pwa');
        const axios = this.answers.features.includes('axios');
        const apollo = this.answers.features.includes('apollo');
        const i18n = this.answers.features.includes('i18n');
        const stereorepoSac = this.answers.stereorepo.includes('sac');
        const pmRun = this.answers.pm === 'yarn' ? 'yarn' : 'npm run';

        return { cms, axios, apollo, pwa, i18n, stereorepoSac, pmRun };
    },
    actions() {
        const validation = validate(this.answers.name);
        validation.warnings &&
            validation.warnings.forEach(warn => {
                console.warn('Warning:', warn);
            });
        validation.errors &&
            validation.errors.forEach(err => {
                console.error('Error:', err);
            });
        validation.errors && validation.errors.length && process.exit(1);

        const actions = [
            {
                type: 'add',
                files: '**',
                templateDir: 'template/nuxt',
                filters: {
                    'cms/apollo-config.js': 'features.includes("apollo")',
                    'cms/queries': 'features.includes("apollo")',
                    'modules/initFragmentMatcher.js': 'features.includes("apollo")',
                    'static/icon.png': 'features.includes("pwa")'
                }
            }
        ];

        actions.push({
            type: 'add',
            files: '*'
        });

        actions.push({
            type: 'move',
            patterns: {
                gitignore: '.gitignore',
                '_package.json': 'package.json'
            }
        });

        actions.push({
            type: 'modify',
            files: 'package.json',
            handler(data) {
                delete data.scripts[''];
                delete data.dependencies[''];
                delete data.devDependencies[''];
                return data;
            }
        });

        return actions;
    },
    async completed() {
        this.gitInit();

        await this.npmInstall({ npmClient: this.answers.pm });

        const options = ['run', 'lint', '--', '--fix'];
        if (this.answers.pm === 'yarn') {
            options.splice(2, 1);
        }
        spawn.sync(this.answers.pm, options, {
            cwd: this.outDir,
            stdio: 'inherit'
        });

        const chalk = this.chalk;
        const isNewFolder = this.outDir !== process.cwd();
        const relativeOutFolder = relative(process.cwd(), this.outDir);
        const cdMsg = isNewFolder ? chalk`\t{cyan cd ${relativeOutFolder}}\n` : '';
        const pmRun = this.answers.pm === 'yarn' ? 'yarn' : 'npm run';

        console.log(chalk`\n🎉  {bold Successfully created project} {cyan ${this.answers.name}}\n`);

        console.log(chalk`  {bold To get started:}\n`);
        console.log(chalk`${cdMsg}\t{cyan ${this.answers.pm} install}\n\t{cyan ${pmRun} dev}\n`);

        console.log(chalk`  {bold To build & start for production:}\n`);
        console.log(chalk`${cdMsg}\t{cyan ${pmRun} build}`);
        console.log(chalk`\t{cyan ${pmRun} start}\n`);

        if (this.answers.test !== 'none') {
            console.log(chalk`  {bold To test:}\n`);
            console.log(chalk`${cdMsg}\t{cyan ${pmRun} test}\n`);
        }
    }
};

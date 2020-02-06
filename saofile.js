const { relative } = require('path');
const spawn = require('cross-spawn');
const validate = require('validate-npm-package-name');

module.exports = {
    prompts: require('./prompts'),
    templateData() {
        const { cms, cmsToken, netlifyEnv, prismicProjectUrl } = this.answers;

        // Features
        const features = {
            crawlerModule: this.answers.features.includes('crawler-module'),
            netlifyLambda: this.answers.features.includes('netlify-lambda'),
            pwa: this.answers.features.includes('pwa'),
            redirectionsModule: this.answers.features.includes('redirections-module'),
            staticDataModule: this.answers.features.includes('static-data-module'),
            staticMediasModule: this.answers.features.includes('static-medias-module')
        };

        // Packages
        const packages = {
            gsap: this.answers.packages.includes('gsap')
        };

        // Package manager
        const pmRun = this.answers.pm === 'yarn' ? 'yarn' : 'npm run';

        // Stereorepo
        const stereorepo = {
            burger: this.answers.stereorepo.includes('burger')
        };

        return { cms, cmsToken, features, netlifyEnv, packages, pmRun, prismicProjectUrl, stereorepo };
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
                    'static/icon.png': 'features.includes("pwa")'
                }
            }
        ];

        // Handling CMS related files
        if (this.answers.cms !== 'none') {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: `template/cms/${this.answers.cms}`,
                filters: {
                    'cms/redirections.js': 'features.includes("redirections-module")',
                    'cms/queries/redirectionsQuery.js': 'features.includes("redirections-module")'
                }
            });
        }

        // Handling Nuxt modules related files
        if (this.answers.features.includes('crawler-module')) {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: 'template/nuxt-modules/crawler-module'
            });
        }

        if (this.answers.features.includes('netlify-functions')) {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: 'template/netlify/functions'
            });
        }

        if (this.answers.features.includes('redirections-module')) {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: 'template/nuxt-modules/redirections-module'
            });
        }

        if (this.answers.features.includes('static-data-module')) {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: 'template/nuxt-modules/static-data-module'
            });
        }

        if (this.answers.features.includes('static-medias-module')) {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: 'template/nuxt-modules/static-medias-module'
            });
        }

        actions.push({
            type: 'add',
            files: '*'
        });

        actions.push({
            type: 'move',
            patterns: {
                '_.editorconfig': '.editorconfig',
                '_.env': '.env',
                '_.eslintrc': '.eslintrc',
                gitignore: '.gitignore',
                '_package.json': 'package.json',
                '_.prettierrc': '.prettierrc'
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
        console.log(chalk`${cdMsg}\t{cyan ${pmRun} dev}\n`);

        console.log(chalk`  {bold To generate for production:}\n`);
        console.log(chalk`${cdMsg}\t{cyan ${pmRun} generate:modern}\n`);

        if (this.answers.test && this.answers.test !== 'none') {
            console.log(chalk`  {bold To test:}\n`);
            console.log(chalk`${cdMsg}\t{cyan ${pmRun} test}\n`);
        }
    }
};

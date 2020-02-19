const { relative } = require('path');
const spawn = require('cross-spawn');
const validate = require('validate-npm-package-name');
const initializeDato = require('./cma/dato/dato-cma');

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
            staticDataModule: this.answers.features.includes('static-data-module')
        };

        // Packages
        const packages = {
            gsap: this.answers.packages.includes('gsap')
        };

        // Package manager
        const pmRun = this.answers.pm === 'yarn' ? 'yarn' : 'npm run';

        // Stereorepo Sac configuration
        const sacConfig = {
            superScroll: this.answers.sacConfig.includes('super-scroll')
        };

        // Stereorepo
        const stereorepo = {
            burger: this.answers.stereorepo.includes('burger')
        };

        return { cms, cmsToken, features, netlifyEnv, packages, pmRun, prismicProjectUrl, sacConfig, stereorepo };
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

        // Generate documentation
        actions.push({
            type: 'add',
            files: '**',
            templateDir: 'template/docs',
            filters: {
                'documentation/cms/README.md': 'cms !== "none"',
                'documentation/custom-nuxt-modules/Crawler.md': 'features.includes("crawler-module")',
                'documentation/custom-nuxt-modules/InitLayoutData.md': 'cms !== "none"',
                'documentation/netlify/Lambda.md': 'features.includes("netlify-lambda")',
                'documentation/custom-nuxt-modules/Redirections.md': 'features.includes("redirections-module")',
                'documentation/custom-nuxt-modules/StaticData.md': 'features.includes("static-data-module")'
            }
        });

        // Handling CMS related files
        if (this.answers.cms !== 'none') {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: `template/cms/${this.answers.cms}`
            });
        }

        // Handling custom features related files
        if (this.answers.features.includes('crawler-module') && this.answers.cms !== 'none') {
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

        if (this.answers.features.includes('redirections-module') && this.answers.cms !== 'none') {
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

        // Handling Stereorepo Sac's config related files
        if (this.answers.sacConfig.includes('super-scroll')) {
            actions.push({
                type: 'add',
                files: '**',
                templateDir: 'template/sac-config/super-scroll'
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

        if (this.answers.cms === 'dato') {
            await initializeDato({ answers: this.answers });
        }

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

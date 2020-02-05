const { readFile, writeFile, existsSync } = require('fs-extra');
const { join } = require('path');
const logger = require('consola');

module.exports = async function(moduleOptions) {
    const options = {
        redirectionsList: [],
        outputName: '_redirects',
        ...this.options.redirections,
        ...moduleOptions
    };
    const redirectionsFilePath = join(this.nuxt.options.generate.dir, options.outputName);
    let redirectionsList = await options.redirectionsList();
    redirectionsList = redirectionsList ? redirectionsList : [];

    this.nuxt.hook('generate:done', async () => {
        const redirectionsStringified = redirectionsList.reduce(
            (acc, currentRedirect) => `${acc}\n${currentRedirect}`,
            ''
        );

        let newRedirectionsData = '';
        if (existsSync(redirectionsFilePath)) {
            newRedirectionsData = await readFile(redirectionsFilePath, 'utf-8');
        }

        await writeFile(redirectionsFilePath, newRedirectionsData.concat(redirectionsStringified), 'utf-8');

        logger.success('Redirections generation done');
    });
};

import { readFile, writeFile, existsSync } from 'fs-extra';
import { join } from 'path';
import logger from 'consola';

const apolloClientImport = () => import('../../config/apollo');

module.exports = function(moduleOptions) {
    const options = {
        outputName: '_redirects',
        query: null,
        redirectionsList: [],
        ...this.options.redirections,
        ...moduleOptions
    };

    this.nuxt.hook('generate:before', async () => {
        // eslint-disable-next-line
        if (!options.query) logger.error(new Error('Redirections module: No query found in redirections module\'s options.'));

        const redirectionsFilePath = join(this.nuxt.options.generate.dir, options.outputName);
        const { default: apolloClient } = await apolloClientImport();

        const redirectionsList = await apolloClient
            .query({ query: options.query })
            .then(({ data }) =>
                data.redirectionGroup && data.redirectionGroup.redirections.length
                    ? data.redirectionGroup.redirections.map(({ redirectionText }) => redirectionText)
                    : []
            );

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
    });
};

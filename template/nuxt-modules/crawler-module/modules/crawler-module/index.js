import logger from 'consola';

import routesGeneration from './routesGeneration';

module.exports = async function(moduleOptions) {
    const options = {
        blacklist: [],
        query: null,
        ...this.options.crawler,
        ...moduleOptions
    };

    // Hook generator to extract routes
    this.nuxt.hook('generate:before', async generator => {
        // HACK: Removing pages' routes ending slash
        this.nuxt.hook('generate:page', async page => {
            page.route = page.route.replace(/\/$/, '');
            return page;
        });

        // 🎣 Add hook when a page is generated
        this.nuxt.hook('generate:extendRoutes', async routes => {
            // Extending the pre-existing routes
            await routesGeneration({ generator, routes, options });
        });

        // 📊 Profile generate
        let startTime;
        let count;
        this.nuxt.hook('generate:routeCreated', () => {
            // Profiling started
            if (!startTime) {
                startTime = new Date();
                count = 0;
            } else {
                count++;
            }
        });

        this.nuxt.hook('generate:done', async () => {
            const time = (new Date() - startTime) / 1000;
            const rps = count / time;
            logger.info(`Generated ${count} routes in ${time} sec (${rps} r/s)`);
        });
    });
};

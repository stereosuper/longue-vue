const { join } = require('path');
const { writeJson } = require('fs-extra');
const logger = require('consola').withScope('docs/crawler');

module.exports = async function(moduleOptions) {
    const options = {
        baseUrl: '',
        blacklist: [],
        ...this.options.crawler,
        ...moduleOptions
    };
    const isBuild = this.options._build;
    const routesFilePath = join(this.nuxt.options.generate.dir, 'routes.json');

    if (isBuild) {
        // Add runtime plugin
        this.addPlugin({
            src: join(__dirname, 'plugin.js')
        });
    }

    const routesList = [];

    // Add route to json
    const addRoute = async route => {
        // Adding the new route to the routes list
        routesList.push(route);
        // Writing / rewriting the routes into the json file
        await writeJson(routesFilePath, routesList).catch(err => {
            logger.error('Writing ${route} route failed', err);
        });
    };

    // Hook generator to extract routes
    this.nuxt.hook('generate:before', async generator => {
        const routes = {};

        // Add hook when a page is generated
        this.nuxt.hook('vue-renderer:ssr:context', async context => {
            routes[context.url] = true;
            context.links = context.links || [];

            const promises = context.links.map(async link => {
                const route = link
                    .replace(/\/+/, '/')
                    .replace(/\?.+/, '')
                    .replace(/#.+/, '');

                const isBlacklisted = !!options.blacklist.filter(item => {
                    if (route.indexOf(item) !== -1) {
                        return true;
                    }
                    return false;
                }).length;

                if (routes[route] || isBlacklisted) {
                    return;
                }
                routes[route] = true;
                await generator.generateRoute({ route, payload: null });
            });
            await Promise.all(promises);

            // Add route to static route.json file
            await addRoute(context.url);
        });

        // Profile generate
        let startTime;
        let count;
        this.nuxt.hook('generate:routeCreated', () => {
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

import { join } from 'path';
import { writeJson } from 'fs-extra';
import logger from 'consola';
import { runPromisesSequence } from '@stereorepo/sac';

import routesGeneration from './routesGeneration';

module.exports = async function(moduleOptions) {
    const options = {
        blacklist: [],
        query: null,
        ...this.options.crawler,
        ...moduleOptions
    };

    const routesFilePath = join(this.nuxt.options.generate.dir, 'routes.json');

    const routesList = [];

    // Add route to routes.json
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
        // 🎣 Add hook when a page is generated
        this.nuxt.hook('generate:extendRoutes', async routes => {
            // Add each route to static route.json file
            const handler = async ({ route }) => {
                await addRoute(route);
            };
            await runPromisesSequence({ array: routes, handler, delay: 10 });
        });

        // Extending the pre-existing routes
        this.nuxt.hook('generate:extendRoutes', async routes => {
            await routesGeneration({ generator, routes, options });
        });

        // 📊 Profile generate
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

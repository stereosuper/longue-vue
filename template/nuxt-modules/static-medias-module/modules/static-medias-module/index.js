const { readJson, readFile, writeFile, existsSync, ensureFileSync, createWriteStream } = require('fs-extra');
const { join } = require('path');
const fetch = require('node-fetch');
const sharp = require('sharp');
const logger = require('consola');

// Regex to find images and songs
const imageUrlRegex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/g;
const trackUrlRegex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:mp3|ogg)/g;

const writeMedia = async ({ filePath, url }) => {
    ensureFileSync(filePath);
    logger.info(`Media: ${url.split('/').pop()}`);

    // Opening stream to write the fetched data
    const fileStream = createWriteStream(filePath);
    const response = await fetch(url)
        .then(response => response.body)
        .catch(err => {
            logger.error(err);
        });

    await new Promise(resolve => {
        response.pipe(fileStream);
        response.on('error', err => {
            logger.error(err);
        });

        // Resolving the promise if no error thrown
        fileStream.on('finish', () => {
            const imageRegex = /\.(jpg|jpeg|png)$/i;

            if (filePath.match(imageRegex)) {
                // Start webp conversion if the media is an image
                const filePathWebp = filePath.replace(imageRegex, '.webp');
                sharp(filePath)
                    .webp({ lossless: true, quality: 70, alphaQuality: 80 })
                    .toFile(filePathWebp)
                    .then(() => {
                        logger.success('Successfully downloaded and converted to webp!');
                        resolve();
                    })
                    .catch(err => {
                        logger.error(err);
                    });
            } else {
                logger.success('Successfully downloaded!');
                resolve();
            }
        });
    });
};

const replaceUrlsInJson = ({ array, json, dir = '' }) => {
    if (!dir.length) return json;
    array.forEach(url => {
        const [newUrl] = url.split('/').reverse();
        json = json.replace(url, `/${dir}/${newUrl}`);
    });
    return json;
};

const wait = async ms => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

// This function allows us to add a timeout between promises (not possible with Promise.all)
const runPromisesSequence = async ({ array, handler: handlerFunction, delay }, callback) => {
    const arrayLength = array.length;
    for (let index = 0; index < arrayLength; index += 1) {
        await handlerFunction(array[index]).then(() => {
            return wait(delay);
        });
    }
    if (callback) {
        callback();
    }
};

module.exports = async function() {
    // Nuxt generate directory path
    const { dir: generateDir } = this.nuxt.options.generate;
    // Name of the static media directory
    const staticMediaDir = 'static-medias';
    const routesFilePath = join(generateDir, 'routes.json');
    const mediaDownloadDelay = 250;

    this.nuxt.hook('generate:done', async () => {
        logger.info('Starting media download');
        const routesExists = existsSync(routesFilePath);
        if (!routesExists) {
            logger.error('Routes file does not exist');
            return;
        }
        const routes = await readJson(routesFilePath).then(routes => routes);
        let mediasUrls = {
            images: [],
            tracks: []
        };

        const promisesUrls = routes.map(async route => {
            const routeDir = join(generateDir, route);

            const payloadFiles = ['payload.js', 'payload.json'];

            // Process all payload files
            const promisesPayloadFiles = payloadFiles.map(async payloadFile => {
                const payloadPath = join(routeDir, payloadFile);

                // Getting the payload file's content
                let payload = await readFile(payloadPath, 'utf-8').then(res => res.replace(/%2F/g, '/'));

                // Replacing all images urls found in the payload and storing those urls for later
                const images = payload.match(imageUrlRegex);
                if (images) {
                    mediasUrls.images = [...new Set([...mediasUrls.images, ...images])];
                    payload = replaceUrlsInJson({
                        array: images,
                        json: payload,
                        dir: `${staticMediaDir}/images`
                    });
                }

                // Replacing all tracks urls found in the payload and storing those urls for later
                const tracks = payload.match(trackUrlRegex);
                if (tracks) {
                    mediasUrls.tracks = [...new Set([...mediasUrls.tracks, ...tracks])];
                    payload = replaceUrlsInJson({
                        array: tracks,
                        json: payload,
                        dir: `${staticMediaDir}/tracks`
                    });
                }

                await writeFile(payloadPath, payload, 'utf-8');
            });
            await Promise.all(promisesPayloadFiles);
        });

        await Promise.all(promisesUrls);

        // Handling all files type download
        const handleFilesTypes = async ([type, urls]) => {
            const mediaTypePath = join(generateDir, staticMediaDir, type);

            // Downloading media
            const handleMediaDownload = async url => {
                const [mediaName] = url.split('/').reverse();
                const filePath = join(mediaTypePath, mediaName);
                await writeMedia({ filePath, url });
            };
            logger.info(`Downloading ${type.charAt(0).toUpperCase() + type.slice(1)}`);

            // The purpose here is to avoid a media server overload, so I added a delay between each promise execution
            await runPromisesSequence(
                {
                    array: urls,
                    handler: handleMediaDownload,
                    delay: mediaDownloadDelay
                },
                () => {
                    logger.success(`${type.charAt(0).toUpperCase() + type.slice(1)} download done`);
                }
            );
        };
        await runPromisesSequence(
            {
                array: Object.entries(mediasUrls),
                handler: handleFilesTypes,
                delay: mediaDownloadDelay
            },
            () => {
                logger.success('All media downloaded');
            }
        );
    });
};

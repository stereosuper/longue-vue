const readline = require('readline');
const chalk = require('chalk');
const { SiteClient } = require('datocms-client');

let saoAnswers = null;
let datoClient = null;

const ids = {
    link: null,
    pages: {
        homePage: null,
        basicPage: null,
        dynamicListPage: null,
        dynamicSinglePage: null
    },
    layout: {
        header: null,
        footer: null
    }
};

let linksAvailableEntities = [];

const requiredPlugins = [
    {
        name: 'Conditional Fields',
        packageName: 'datocms-plugin-conditional-fields'
    }
];

const datoLogger = message => {
    console.log(chalk`  {white ✅ DatoCMS: ${message}}`);
};

const handleSiteSettings = async () => {
    try {
        const { id: siteId } = await datoClient.site.find();

        await datoClient.site.update({
            id: siteId,
            globalSeo: {
                siteName: 'My Awesome New Website 🔥',
                fallbackSeo: {
                    title: 'Default meta title',
                    description: 'Default meta description',
                    image: '123',
                    twitterCard: 'summary_large_image'
                },
                titleSuffix: ' - My Awesome Website',
                facebookPageUrl: 'http://facebook.com/awesomewebsite',
                twitterAccount: '@awesomewebsite'
            },
            locales: ['fr-FR'],
            name: 'My Awesome New Website 🔥',
            theme: {
                primaryColor: {
                    red: 0,
                    green: 169,
                    blue: 224,
                    alpha: 255
                },
                lightColor: {
                    red: 0,
                    green: 169,
                    blue: 224,
                    alpha: 255
                },
                accentColor: {
                    red: 0,
                    green: 169,
                    blue: 224,
                    alpha: 255
                },
                darkColor: {
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 255
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};

const checkPlugins = async () => {
    try {
        const installedPlugins = await datoClient.plugins
            .all()
            .then(plugins => plugins.map(({ packageName }) => packageName));
        return requiredPlugins.filter(({ packageName }) => !installedPlugins.includes(packageName));
    } catch (error) {
        console.error(error);
    }
};

const getPluginsList = async () => {
    return checkPlugins().then(pluginsToInstall =>
        pluginsToInstall.reduce(
            (acc, { name }, index) => `${acc}${name}${index !== pluginsToInstall.length - 1 ? ', ' : ''}`,
            ''
        )
    );
};

const handlePlugins = async () => {
    let pluginsToInstall = await getPluginsList();

    const waitForPluginsValidation = async () => {
        try {
            await new Promise((resolve, reject) => {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question('  ✅ Is it done? ', answer => {
                    getPluginsList().then(pluginsToInstall => {
                        if (answer !== 'YES' || pluginsToInstall.length > 0) {
                            if (pluginsToInstall.length > 0) {
                                console.log(chalk`\n  {cyan Please install the following DatoCMS plugins:}`);
                                console.log(chalk`  {red ${pluginsToInstall}}\n`);
                            }
                            rl.close();
                            reject();
                        } else {
                            rl.close();
                            resolve();
                        }
                    });
                });
            });
        } catch (error) {
            await waitForPluginsValidation();
        }
    };

    if (pluginsToInstall.length > 0) {
        console.log(chalk`\n  {cyan Please install the following DatoCMS plugins:}`);
        console.log(chalk`  {red ${pluginsToInstall}}\n`);
        console.log(chalk`  {cyan Once you're done type {bold {white YES}}}\n`);

        await waitForPluginsValidation();
    }
};

const createHomePageModel = async () => {
    // Model declaration
    const { id } = await datoClient.itemTypes.create({
        name: 'Home page',
        apiKey: 'home_page',
        singleton: true,
        draftModeActive: true,
        allLocalesRequired: true,
        collectionAppeareance: 'table',
        modularBlock: false,
        orderingDirection: null,
        sortable: false,
        tree: false,
        orderingField: null,
        titleField: null
    });

    ids.pages.homePage = id;

    // Entity title field declaration
    datoClient.fields.create(id, {
        apiKey: 'entity_title',
        label: 'Entity title',
        localized: false,
        validators: {
            required: {}
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This is your entity title',
        position: 1
    });

    // SEO field declaration
    datoClient.fields.create(id, {
        label: 'SEO',
        fieldType: 'seo',
        defaultValue: null,
        localized: true,
        apiKey: 'seo',
        hint: null,
        validators: {},
        appeareance: { editor: 'seo', parameters: {}, addons: [] },
        position: 2
    });

    datoLogger('Home page model created');
};

const createBasicPageModel = async () => {
    // Model declaration
    const { id } = await datoClient.itemTypes.create({
        name: 'Basic page',
        apiKey: 'basic_page',
        singleton: false,
        draftModeActive: true,
        allLocalesRequired: true,
        collectionAppeareance: 'table',
        modularBlock: false,
        orderingDirection: null,
        sortable: false,
        tree: false,
        orderingField: null,
        titleField: null
    });

    ids.pages.basicPage = id;

    // Entity title field declaration
    datoClient.fields.create(id, {
        apiKey: 'entity_title',
        label: 'Entity title',
        localized: false,
        validators: {
            required: {}
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This is your entity title',
        position: 1
    });

    // Slug field declaration
    datoClient.fields.create(id, {
        label: 'Slug',
        fieldType: 'string',
        defaultValue: null,
        localized: true,
        apiKey: 'slug',
        hint: null,
        validators: {
            required: {},
            unique: {},
            format: { customPattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        position: 2
    });

    // SEO field declaration
    datoClient.fields.create(id, {
        label: 'SEO',
        fieldType: 'seo',
        defaultValue: null,
        localized: true,
        apiKey: 'seo',
        hint: null,
        validators: {},
        appeareance: { editor: 'seo', parameters: {}, addons: [] },
        position: 3
    });

    datoLogger('Basic page model created');
};

const createDynamicListPageModel = async () => {
    // Model declaration
    const { id } = await datoClient.itemTypes.create({
        name: 'Dynamic list page',
        apiKey: 'dynamic_list_page',
        singleton: true,
        draftModeActive: true,
        allLocalesRequired: true,
        collectionAppeareance: 'table',
        modularBlock: false,
        orderingDirection: null,
        sortable: false,
        tree: false,
        orderingField: null,
        titleField: null
    });

    ids.pages.dynamicListPage = id;

    // Entity title field declaration
    datoClient.fields.create(id, {
        apiKey: 'entity_title',
        label: 'Entity title',
        localized: false,
        validators: {
            required: {}
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This is your entity title',
        position: 1
    });

    // SEO field declaration
    datoClient.fields.create(id, {
        label: 'SEO',
        fieldType: 'seo',
        defaultValue: null,
        localized: true,
        apiKey: 'seo',
        hint: null,
        validators: {},
        appeareance: { editor: 'seo', parameters: {}, addons: [] },
        position: 2
    });

    datoLogger('Dynamic list page model created');
};

const createDynamicSinglePageModel = async () => {
    // Model declaration
    const { id } = await datoClient.itemTypes.create({
        name: 'Dynamic single page',
        apiKey: 'dynamic_single_page',
        singleton: false,
        draftModeActive: true,
        allLocalesRequired: true,
        collectionAppeareance: 'table',
        modularBlock: false,
        orderingDirection: null,
        sortable: false,
        tree: false,
        orderingField: null,
        titleField: null
    });

    ids.pages.dynamicSinglePage = id;

    // Entity title field declaration
    datoClient.fields.create(id, {
        apiKey: 'entity_title',
        label: 'Entity title',
        localized: false,
        validators: {
            required: {}
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This is your entity title',
        position: 1
    });

    // Slug field declaration
    datoClient.fields.create(id, {
        label: 'Slug',
        fieldType: 'string',
        defaultValue: null,
        localized: true,
        apiKey: 'slug',
        hint: null,
        validators: {
            required: {},
            unique: {},
            format: { customPattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        position: 2
    });

    // SEO field declaration
    datoClient.fields.create(id, {
        label: 'SEO',
        fieldType: 'seo',
        defaultValue: null,
        localized: true,
        apiKey: 'seo',
        hint: null,
        validators: {},
        appeareance: { editor: 'seo', parameters: {}, addons: [] },
        position: 3
    });

    datoLogger('Dynamic single page model created');
};

const createLinkModel = async () => {
    const [conditionalFields] = await datoClient.plugins
        .all()
        .then(plugins => plugins.filter(plugin => plugin.packageName === 'datocms-plugin-conditional-fields'));

    // Model declaration
    const { id: linkModelID } = await datoClient.itemTypes.create({
        name: 'Link',
        apiKey: 'link',
        singleton: false,
        draftModeActive: true,
        allLocalesRequired: true,
        collectionAppeareance: 'table',
        modularBlock: false,
        orderingDirection: null,
        sortable: false,
        tree: false,
        orderingField: null,
        titleField: null
    });

    ids.link = linkModelID;

    // Link label field declaration
    datoClient.fields.create(linkModelID, {
        apiKey: 'link_label',
        label: 'Link label',
        localized: true,
        validators: {
            required: {}
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This will be your link text',
        position: 1
    });

    // Link title field declaration
    datoClient.fields.create(linkModelID, {
        apiKey: 'link_title',
        label: 'Link title',
        localized: true,
        validators: {
            required: {}
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This will be your link aria-label',
        position: 2
    });

    // Is external field declaration
    datoClient.fields.create(linkModelID, {
        apiKey: 'is_external',
        label: 'Is external',
        localized: false,
        validators: {},
        appeareance: {
            editor: 'boolean',
            parameters: {},
            addons: [
                {
                    id: conditionalFields.id,
                    parameters: { slaveFields: 'external_link' }
                }
            ]
        },
        defaultValue: false,
        fieldType: 'boolean',
        hint: 'The external link toggle',
        position: 3
    });

    // External link field declaration
    datoClient.fields.create(linkModelID, {
        apiKey: 'external_link',
        label: 'External link',
        localized: false,
        validators: {},
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This will be your external link url',
        position: 4
    });

    // Is internal field declaration
    datoClient.fields.create(linkModelID, {
        apiKey: 'is_internal',
        label: 'Is internal',
        localized: false,
        validators: {},
        appeareance: {
            editor: 'boolean',
            parameters: {},
            addons: [
                {
                    id: conditionalFields.id,
                    parameters: { slaveFields: 'internal_link' }
                }
            ]
        },
        defaultValue: false,
        fieldType: 'boolean',
        hint: 'The internal link toggle',
        position: 5
    });

    // Internal link field declaration
    linksAvailableEntities = Object.values(ids.pages).filter(Boolean);

    datoClient.fields.create(linkModelID, {
        apiKey: 'internal_link',
        label: 'Internal link',
        localized: false,
        validators: { itemItemType: { itemTypes: linksAvailableEntities } },
        appeareance: { editor: 'link_select', parameters: {}, addons: [] },
        defaultValue: false,
        fieldType: 'link',
        hint: 'The internal link toggle',
        position: 6
    });

    datoLogger('Link model created');
};

const createHeaderModel = async () => {
    // Model declaration
    const { id } = await datoClient.itemTypes.create({
        name: 'Header',
        apiKey: 'header',
        singleton: true,
        draftModeActive: true,
        allLocalesRequired: true,
        collectionAppeareance: 'table',
        modularBlock: false,
        orderingDirection: null,
        sortable: false,
        tree: false,
        orderingField: null,
        titleField: null
    });

    ids.layout.header = id;

    // Entity title field declaration
    datoClient.fields.create(id, {
        apiKey: 'entity_title',
        label: 'Entity title',
        localized: false,
        validators: {
            required: {}
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This is your entity title',
        position: 1
    });

    // Entity title field declaration
    datoClient.fields.create(id, {
        label: 'Menu links',
        fieldType: 'links',
        defaultValue: null,
        localized: false,
        apiKey: 'menu_links',
        hint: null,
        validators: { itemsItemType: { itemTypes: [ids.link] } },
        appeareance: { editor: 'links_select', parameters: {}, addons: [] },
        position: 2
    });

    datoLogger('Header model created');
};

const createFooterModel = async () => {
    // Model declaration
    const { id } = await datoClient.itemTypes.create({
        name: 'Footer',
        apiKey: 'footer',
        singleton: true,
        draftModeActive: true,
        allLocalesRequired: true,
        collectionAppeareance: 'table',
        modularBlock: false,
        orderingDirection: null,
        sortable: false,
        tree: false,
        orderingField: null,
        titleField: null
    });

    ids.layout.footer = id;

    // Entity title field declaration
    datoClient.fields.create(id, {
        apiKey: 'entity_title',
        label: 'Entity title',
        localized: false,
        validators: {
            required: {}
        },
        appeareance: {
            editor: 'single_line',
            parameters: { heading: false },
            addons: []
        },
        defaultValue: null,
        fieldType: 'string',
        hint: 'This is your entity title',
        position: 1
    });

    datoLogger('Footer model created');
};

const createMenuItems = async () => {
    const pagesIds = Object.values(ids.pages).filter(Boolean);
    const layoutsIds = Object.values(ids.layout).filter(Boolean);

    // Getting current menus items
    const menuItemsIds = await datoClient.menuItems.all().then(menuItems =>
        menuItems.reduce(
            (acc, { id, itemType }) => {
                if (Object.values(ids.layout).includes(itemType)) {
                    acc.layout.push(id);
                } else if (Object.values(ids.pages).includes(itemType)) {
                    acc.pages.push(id);
                }
                return acc;
            },
            { layout: [], pages: [] }
        )
    );

    // Creating menu items
    if (layoutsIds.length) {
        const { id: layoutMenuItemId } = await datoClient.menuItems.create({
            label: 'Layout',
            externalUrl: null,
            position: 1,
            openInNewTab: false,
            itemType: null,
            parent: null,
            children: layoutsIds
        });

        menuItemsIds.layout.forEach(async id => {
            const currentItemState = await datoClient.menuItems.find(id);

            await datoClient.menuItems.update(id, {
                ...currentItemState,
                parent: layoutMenuItemId
            });
        });

        datoLogger('Layout menu item created');
    }

    if (pagesIds.length) {
        const { id: pagesMenuItemId } = await datoClient.menuItems.create({
            label: 'Pages',
            externalUrl: null,
            position: 2,
            openInNewTab: false,
            itemType: null,
            parent: null,
            children: pagesIds
        });

        menuItemsIds.pages.forEach(async id => {
            const currentItemState = await datoClient.menuItems.find(id);

            await datoClient.menuItems.update(id, {
                ...currentItemState,
                parent: pagesMenuItemId
            });
        });

        datoLogger('Pages menu item created');
    }
};

const createRedirectionsModel = async () => {
    if (!saoAnswers.features.includes('redirections-module')) return;

    // Redirection group model declaration
    const { id: redirectionGroupModelId } = await datoClient.itemTypes.create({
        name: 'Redirection group',
        apiKey: 'redirection_group',
        singleton: true,
        draftModeActive: true,
        allLocalesRequired: true,
        collectionAppeareance: 'table',
        modularBlock: false,
        orderingDirection: null,
        sortable: false,
        tree: false,
        orderingField: null,
        titleField: null
    });

    // Redirection model declaration
    const { id: redirectionModelId } = await datoClient.itemTypes.create({
        name: 'Redirection',
        apiKey: 'redirection',
        collectionAppeareance: 'table',
        singleton: false,
        allLocalesRequired: true,
        sortable: false,
        modularBlock: true,
        draftModeActive: false,
        tree: false,
        orderingDirection: null,
        hasSingletonItem: false,
        singletonItem: null,
        titleField: null,
        orderingField: null
    });

    await datoClient.fields.create(redirectionGroupModelId, {
        label: 'Redirections',
        fieldType: 'rich_text',
        defaultValue: null,
        localized: false,
        apiKey: 'redirections',
        hint: null,
        validators: { richTextBlocks: { itemTypes: [redirectionModelId] } },
        appeareance: { editor: 'rich_text', parameters: { startCollapsed: false }, addons: [] },
        position: 1
    });

    await datoClient.fields.create(redirectionModelId, {
        label: 'Redirection text',
        fieldType: 'string',
        defaultValue: null,
        localized: false,
        apiKey: 'redirection_text',
        hint: null,
        validators: { required: {} },
        appeareance: { editor: 'single_line', parameters: { heading: false }, addons: [] },
        position: 1
    });

    datoLogger('Redirections model created');
};

const handleModels = async () => {
    try {
        const allModelsKeys = await datoClient.itemTypes.all().then(models => models.map(({ apiKey }) => apiKey));

        if (!allModelsKeys.includes('home_page')) {
            await createHomePageModel();
        }

        if (!allModelsKeys.includes('basic_page')) {
            await createBasicPageModel();
        }

        if (!allModelsKeys.includes('dynamic_list_page')) {
            await createDynamicListPageModel();
        }

        if (!allModelsKeys.includes('dynamic_single_page')) {
            await createDynamicSinglePageModel();
        }

        if (!allModelsKeys.includes('link')) {
            await createLinkModel();
        }

        if (!allModelsKeys.includes('header')) {
            await createHeaderModel();
        }

        if (!allModelsKeys.includes('footer')) {
            await createFooterModel();
        }

        await createMenuItems();

        if (!allModelsKeys.includes('redirection_group') && !allModelsKeys.includes('redirection')) {
            await createRedirectionsModel();
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = async ({ answers }) => {
    saoAnswers = answers;
    if (!saoAnswers) return;

    datoClient = new SiteClient(answers.datoFullAccessToken);
    if (!datoClient) return;

    try {
        await handleSiteSettings();
        await handlePlugins();
        await handleModels();
    } catch (error) {
        throw new Error(error);
    }
};

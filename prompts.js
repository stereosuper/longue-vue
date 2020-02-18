const { random } = require('superb');

module.exports = [
    {
        name: 'name',
        message: '👉 Project name',
        default: '{outFolder}'
    },
    {
        name: 'description',
        message: '👉 Project description',
        default: `My ${random()} Longue Vue project 😍`
    },
    {
        name: 'author',
        type: 'string',
        message: '👉 Author name',
        default: '{gitUser.name}',
        store: true
    },
    {
        name: 'pm',
        message: '👉 Choose the package manager',
        choices: [{ name: 'Npm', value: 'npm' }, { name: 'Yarn', value: 'yarn' }],
        type: 'list',
        default: 'npm'
    },
    {
        name: 'netlifyEnv',
        message: '👉 Your Netlify environment value',
        choices: [
            { name: 'Production 🚀', value: 'production' },
            { name: 'Preproduction 💅', value: 'preproduction' },
            { name: 'Development 🔨', value: 'development' }
        ],
        type: 'list',
        default: 'development'
    },
    {
        name: 'cms',
        message: '👉 Choose the CMS',
        choices: [
            { name: 'DatoCMS 😘', value: 'dato' },
            { name: 'Prismic 💪', value: 'prismic' },
            { name: 'None 🤔', value: 'none' }
        ],
        type: 'list',
        default: 'dato'
    },
    {
        name: 'prismicProjectUrl',
        message: '👉 Your Prismic project url (without the ending slash)',
        default: 'https://{outFolder}.prismic.io',
        when: answers => answers.cms === 'prismic'
    },
    {
        name: 'cmsToken',
        message: '👉 Your CMS read token',
        default: 'MY_TOKEN_1234567890',
        when: answers => answers.cms !== 'none'
    },
    {
        name: 'datoFullAccessToken',
        message: '👉 DatoCMS full-access token',
        default: 'MY_FULL_ACCESS_TOKEN_1234567890',
        when: answers => answers.cms === 'dato'
    },
    {
        name: 'features',
        message: '👉 Choose your custom features',
        type: 'checkbox',
        pageSize: 10,
        choices: [
            { name: 'Crawler Module', value: 'crawler-module' },
            { name: 'Netlify Lambda Functions', value: 'netlify-lambda' },
            { name: 'Progressive Web App (PWA) Support', value: 'pwa' },
            { name: 'Redirections Module', value: 'redirections-module' },
            { name: 'Static Data Module', value: 'static-data-module' }
        ],
        default: []
    },
    {
        name: 'stereorepo',
        message: '👉 Choose Stéréorepo modules (Sac is included by default)',
        type: 'checkbox',
        pageSize: 10,
        choices: [{ name: 'Burger', value: 'burger' }],
        default: []
    },
    {
        name: 'sacConfig',
        message: '👉 Customize Sac configuration',
        type: 'checkbox',
        pageSize: 10,
        choices: [{ name: 'Initialize SuperScroll', value: 'super-scroll' }],
        default: []
    },
    {
        name: 'packages',
        message: '👉 Choose some packages',
        type: 'checkbox',
        pageSize: 10,
        choices: [{ name: 'GSAP', value: 'gsap' }],
        default: []
    }
];

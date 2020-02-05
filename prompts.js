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
        name: 'cmsToken',
        message: '👉 Your CMS token',
        default: 'MY_TOKEN_1234567890',
        when: answers => answers.cms !== 'none'
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
        name: 'features',
        message: '👉 Choose Nuxt.js modules',
        type: 'checkbox',
        pageSize: 10,
        choices: [
            { name: 'Crawler module', value: 'crawler-module' },
            { name: 'Progressive Web App (PWA) Support', value: 'pwa' },
            { name: 'Redirections module', value: 'redirections-module' },
            { name: 'Static data module', value: 'static-data-module' },
            { name: 'Static medias module', value: 'static-medias-module' }
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
        name: 'packages',
        message: '👉 Choose some packages',
        type: 'checkbox',
        pageSize: 10,
        choices: [{ name: 'GSAP', value: 'gsap' }],
        default: []
    }
];

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
            { name: 'WordPress 🤮', value: 'wordpress' },
            { name: 'None 🤔', value: 'none' }
        ],
        type: 'list',
        default: 'dato'
    },
    {
        name: 'features',
        message: '👉 Choose Nuxt.js modules',
        type: 'checkbox',
        pageSize: 10,
        choices: [
            { name: 'Apollo', value: 'apollo' },
            { name: 'Axios', value: 'axios' },
            { name: 'I18n', value: 'i18n' },
            { name: 'Progressive Web App (PWA) Support', value: 'pwa' }
        ],
        default: []
    },
    {
        name: 'stereorepo',
        message: '👉 Choose Stéréorepo modules',
        type: 'checkbox',
        pageSize: 10,
        choices: [{ name: 'Sac', value: 'sac' }, { name: 'Burger', value: 'burger' }],
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

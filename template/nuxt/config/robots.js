const robotsConfig = ({ env, url }) => {
    const isDevEnv = env === 'development';
    return isDevEnv
        ? { UserAgent: '*', Disallow: '/' }
        : { UserAgent: '*', Disallow: ['/404'], Sitemap: `${url}/sitemap.xml` };
};

export default robotsConfig;

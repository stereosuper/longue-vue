const robotsConfig = ({ env, url }) => {
    const isProdEnv = env === 'production';
    return isProdEnv
        ? { UserAgent: '*', Disallow: ['/404'], Sitemap: `${url}/sitemap.xml` }
        : { UserAgent: '*', Disallow: '/' };
};

export default robotsConfig;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://designsystemet.no',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};

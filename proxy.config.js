const proxy = [
  {
    context: '/api',
    target: 'https://localhost:7084',
    pathRewrite: { '/api': '' }
  }
];
module.exports = proxy;
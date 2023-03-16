module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/wrappers',
        permanent: true,
      },
    ]
  },
}

module.exports = process.env.AUTHOM_COV
  ? require('./lib-cov/authom')
  : require('./lib/authom');
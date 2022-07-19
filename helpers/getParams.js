

module.exports = (params, property, defaultValue) => {
  if ( params[property] !== undefined  ) {
    return params[property];
  }
  return defaultValue;
};

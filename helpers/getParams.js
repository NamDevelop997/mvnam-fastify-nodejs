

module.exports = (params, property, defaultValue) => {
  if ( params[property] !== undefined  ||  params.hasOwnProperty(property)) {
    return params[property];
  }
  return defaultValue;
};

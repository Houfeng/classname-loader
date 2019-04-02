const utils = require('ntils');

function create(prefix) {

  function convert(name, addPrefix) {
    if (!name) {
      return '';
    } else if (utils.isString(name) && name.includes(' ')) {
      return convert(name.split(' '), addPrefix);
    } else if (utils.isString(name) && name.includes(',')) {
      return convert(name.split(','), addPrefix);
    } else if (utils.isArray(name)) {
      return name.map(item => convert(item, addPrefix)).join(' ').trim();
    } else if (utils.isObject(name)) {
      return convert(Object.keys(name).filter(key => name[key]), addPrefix);
    } else if (utils.startWith(name, prefix)) {
      return name;
    } else {
      let trimedName = name
        .trim()
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
      if (!trimedName) return '';
      return addPrefix ? `${prefix}-${trimedName}` : trimedName;
    }
  }

  function cname(name, literal) {
    if (literal === true || literal === false) {
      return convert(name, literal);
    } else {
      let convertNames = convert(name, true);
      if (literal) {
        convertNames += ` ${convert(literal, false)}`;
      }
      return convertNames;
    }
  }

  return cname;
}

module.exports = create;
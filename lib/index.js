const utils = require('ntils');
const loaderUtils = require('loader-utils');

//将源码做排除处理
function external(src) {
  let items = [];
  [/\'.+\'/g, /\".+\"/g, /url\s*\(.+\)/ig].forEach(regexp => {
    src = src.replace(regexp, text => {
      let id = utils.newGuid();
      items.push({ id, text })
      return id;
    });
  });
  return { src, items };
}

//恢复排除处理
function recovery(opts) {
  let { src, items } = opts;
  items.reverse().forEach(item => {
    src = src.replace(item.id, item.text);
  });
  return src;
}

//处理前缀
function handle(src, opts) {
  src = src.replace(/\.([a-z\-0-9]+)/ig, ($0, $1) => {
    if (!(/^[a-z]/i.test($1)) || opts.exclude.some(exp => exp.test($1))) {
      return `.${$1}`;
    }
    return `.${opts.prefix}${$1}`;
  });
  return src;
}

//处理选项
function options(opts) {
  opts = opts || {};
  opts.exclude = opts.exclude || [];
  if (utils.isString(opts.exclude)) {
    try {
      opts.exclude = JSON.parse(opts.exclude);
    } catch (err) {
      opts.exclude = [opts.exclude];
    }
  }
  opts.exclude = opts.exclude.map(item => new RegExp(item));
  return opts;
}

//loader
function loader(content) {
  if (this.resource && this.resource.indexOf('node_modules') > -1) {
    return content;
  }
  let opts = options(loaderUtils.getOptions(this));
  if (!opts.prefix) return content;
  let result = external(content);
  result.src = handle(result.src, opts);
  return recovery(result);
};

module.exports = loader;
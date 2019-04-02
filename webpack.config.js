module.exports = function (config) {
  config.module.loaders.find(item => {
    let test = item.test.toString();
    if (!test.includes('.less')) return;
    item.loader.splice(2, 0, `${require.resolve('./')}?prefix=ui-&exclude=aa-`);
  });
};
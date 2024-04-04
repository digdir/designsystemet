const plugin = () => {
  return {
    postcssPlugin: 'postcss-layers',
    Once(root, { AtRule }) {
      const layer = new AtRule({
        name: 'layer',
        params: 'fds',
        nodes: root.nodes,
      });
      root.removeAll();
      root.append(layer);
    },
  };
};
plugin.postcss = true;

module.exports = plugin;

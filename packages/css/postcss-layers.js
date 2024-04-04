const plugin = () => {
  const filters = [];

  filters.push({
    layerName: 'fds',
  });

  return {
    postcssPlugin: 'postcss-layers',
    Once(root, { AtRule }) {
      const layerNames = ['fds'];

      for (const layerName of layerNames) {
        const layer = new AtRule({
          name: 'layer',
          params: layerName,
          nodes: root.nodes,
        });
        root.removeAll();
        root.append(layer);
      }
    },
  };
};
plugin.postcss = true;

module.exports = plugin;

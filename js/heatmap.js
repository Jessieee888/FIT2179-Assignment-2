function renderHeatmap() {
  fetch("data/heatmap.json")
    .then(r => r.json())
    .then(spec => {
      spec.data.values = ALL_DATA;
      return vegaEmbed("#vis-heatmap", spec, { actions: false });
    });
}
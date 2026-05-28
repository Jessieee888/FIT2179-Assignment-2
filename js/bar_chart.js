function renderRemoteBar() {
  fetch("data/bar_chart.json")
    .then(r => r.json())
    .then(spec => {
      spec.data.values = ALL_DATA;
      return vegaEmbed("#vis-remote-bar", spec, { actions: false });
    });
}
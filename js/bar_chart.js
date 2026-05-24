function renderRemoteBar() {
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 300,
    "background": "#f2ece0",
    "data": { "values": ALL_DATA },
    "mark": { "type": "bar" },
    "encoding": {
      "x": {
        "aggregate": "count",
        "type": "quantitative",
        "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": "Number of Schools", "gridColor": "#d8ccb0" }
      },
      "y": {
        "field": "ABS Remoteness Area Name",
        "type": "nominal",
        "sort": { "op": "count", "order": "descending" },
        "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": null }
      },
      "color": {
        "field": "ABS Remoteness Area Name",
        "type": "nominal",
        "scale": {
          "domain": ["Major Cities", "Inner Regional", "Outer Regional", "Remote", "Very Remote"],
          "range":  ["#3a7ab5", "#2a6a2a", "#c8a040", "#c06030", "#6a1a1a"]
        },
        "legend": null
      },
      "tooltip": [
        { "field": "ABS Remoteness Area Name", "title": "Remoteness" },
        { "aggregate": "count", "title": "Number of Schools" }
      ]
    },
    "config": { "view": { "stroke": null } }
  };
  vegaEmbed("#vis-remote-bar", spec, { actions: false });
}
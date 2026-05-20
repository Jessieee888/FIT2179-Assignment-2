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
        "sort": ["-x"],
        "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": null }
      },
      "color": {
        "field": "ABS Remoteness Area Name",
        "type": "nominal",
        "scale": {
          "domain": ["Major Cities", "Inner Regional", "Outer Regional", "Remote", "Very Remote"],
          "range":  ["#1a1a5a", "#2a6a2a", "#8a6a1a", "#e03e1a", "#6a1a1a"]
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
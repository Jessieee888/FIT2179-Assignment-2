function renderBar() {
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "background": "#f2ece0",
    "data": { "values": ALL_DATA },
    "mark": { "type": "bar" },
    "encoding": {
      "x": {
        "field": "State",
        "type": "nominal",
        "sort": "-y",
        "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": "State" }
      },
      "y": {
        "aggregate": "count",
        "type": "quantitative",
        "stack": "zero",
        "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": "Number of Schools", "gridColor": "#d8ccb0" }
      },
      "color": {
        "field": "School Sector",
        "type": "nominal",
        "scale": {
          "domain": ["Government", "Catholic", "Independent"],
          "range":  ["#5a3e8a", "#8a3e20", "#1a6a40"]
        },
        "legend": { "title": "Sector", "labelColor": "#3a2a10", "titleColor": "#3a2a10" }
      },
      "tooltip": [
        { "field": "State",         "title": "State" },
        { "field": "School Sector", "title": "Sector" },
        { "aggregate": "count",     "title": "Number of Schools" }
      ]
    },
    "config": { "view": { "stroke": null } }
  };
  vegaEmbed("#vis-bar", spec, { actions: false });
}
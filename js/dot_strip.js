function renderDotStrip() {
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "background": "#f2ece0",
    "data": { "values": ALL_DATA },
    "mark": {
      "type": "circle",
      "opacity": 0.4,
      "size": 8
    },
    "encoding": {
      "x": {
        "field": "State",
        "type": "nominal",
        "sort": { "op": "count", "order": "descending" },
        "axis": {
          "labelColor": "#3a2a10",
          "titleColor": "#3a2a10",
          "title": "State",
          "labelAngle": 0
        }
      },
      "y": {
        "field": "School Sector",
        "type": "nominal",
        "sort": ["Government", "Catholic", "Independent"],
        "axis": {
          "labelColor": "#3a2a10",
          "titleColor": "#3a2a10",
          "title": null
        }
      },
      "color": {
        "field": "School Sector",
        "type": "nominal",
        "scale": {
          "domain": ["Government", "Catholic", "Independent"],
          "range":  ["#5a3e8a", "#e03e1a", "#1a6a40"]
        },
        "legend": null
      },
      "xOffset": {
        "field": "School Name",
        "type": "nominal",
        "band": 0.8
      },
      "tooltip": [
        { "field": "School Name",   "title": "School" },
        { "field": "School Sector", "title": "Sector" },
        { "field": "State",         "title": "State" },
        { "field": "School Type",   "title": "Type" }
      ]
    },
    "config": { "view": { "stroke": null } }
  };
  vegaEmbed("#vis-dot-strip", spec, { actions: false });
}
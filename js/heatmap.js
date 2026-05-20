function renderHeatmap() {
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 300,
    "background": "#f2ece0",
    "data": { "values": ALL_DATA },
    "mark": { "type": "rect" },
    "encoding": {
      "x": {
        "field": "School Sector",
        "type": "nominal",
        "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": "Sector", "labelAngle": 0 }
      },
      "y": {
        "field": "ABS Remoteness Area Name",
        "type": "nominal",
        "sort": ["Major Cities", "Inner Regional", "Outer Regional", "Remote", "Very Remote"],
        "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": null }
      },
      "color": {
        "aggregate": "count",
        "type": "quantitative",
        "scale": { "scheme": "orangered" },
        "legend": { "title": "Schools", "labelColor": "#3a2a10", "titleColor": "#3a2a10" }
      },
      "tooltip": [
        { "field": "School Sector",           "title": "Sector" },
        { "field": "ABS Remoteness Area Name","title": "Remoteness" },
        { "aggregate": "count",               "title": "Number of Schools" }
      ]
    },
    "config": { "view": { "stroke": "#c8b89a" } }
  };
  vegaEmbed("#vis-heatmap", spec, { actions: false });
}
let selectedBarTypes = new Set(["Primary", "Secondary", "Combined"]);

function toggleBarType(type, btn) {
  if (selectedBarTypes.has(type)) {
    if (selectedBarTypes.size === 1) return;
    selectedBarTypes.delete(type);
    btn.classList.remove("type-btn--active");
  } else {
    selectedBarTypes.add(type);
    btn.classList.add("type-btn--active");
  }
  renderBar();
}

function renderBar() {
  const filtered = ALL_DATA.filter(d => selectedBarTypes.has(d["School Type"]));

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "background": "#f2ece0",
    "data": { "values": filtered },
    "mark": { "type": "bar" },
    "encoding": {
      "x": {
        "field": "State",
        "type": "nominal",
        "sort": { "op": "count", "order": "descending" },
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
          "range":  ["#5a3e8a", "#e03e1a", "#1a6a40"]
        },
        "legend": { "title": "Sector", "labelColor": "#3a2a10", "titleColor": "#3a2a10" }
      },
      "tooltip": [
        { "field": "State",         "title": "State" },
        { "field": "School Sector", "title": "Sector" },
        { "field": "School Type",   "title": "Type" },
        { "aggregate": "count",     "title": "Number of Schools" }
      ]
    },
    "config": { "view": { "stroke": null } }
  };
  vegaEmbed("#vis-bar", spec, { actions: false });
}
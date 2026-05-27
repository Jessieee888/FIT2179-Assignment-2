let selectedSchoolTypes = new Set(["Primary", "Secondary", "Combined"]);

function toggleSchoolType(type, btn) {
  if (selectedSchoolTypes.has(type)) {
    if (selectedSchoolTypes.size === 1) return; // keep at least one selected
    selectedSchoolTypes.delete(type);
    btn.classList.remove("type-btn--active");
  } else {
    selectedSchoolTypes.add(type);
    btn.classList.add("type-btn--active");
  }
  renderGroupedBar();
}

function renderGroupedBar() {
  const filtered = ALL_DATA.filter(d => selectedSchoolTypes.has(d["School Type"]));

  const activeDomain = ["Primary", "Secondary", "Combined"].filter(t => selectedSchoolTypes.has(t));
  const colorMap = { "Primary": "#008b8b", "Secondary": "#ca8d7f", "Combined": "#1c1d87" };

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 380,
    "background": "#f2ece0",
    "data": { "values": filtered },
    "mark": { "type": "bar", "cornerRadiusTopLeft": 2, "cornerRadiusTopRight": 2 },
    "encoding": {
      "x": {
        "field": "State",
        "type": "nominal",
        "sort": { "op": "count", "order": "descending" },
        "axis": {
          "labelColor": "#3a2a10", "titleColor": "#3a2a10",
          "title": "State", "labelFontSize": 11,
          "titleFontSize": 12, "titleFontWeight": "bold"
        }
      },
      "xOffset": {
        "field": "School Type",
        "type": "nominal",
        "sort": ["Primary", "Secondary", "Combined"]
      },
      "y": {
        "aggregate": "count",
        "type": "quantitative",
        "axis": {
          "labelColor": "#3a2a10", "titleColor": "#3a2a10",
          "title": "Number of Schools",
          "gridColor": "#d8ccb0", "gridDash": [3, 3],
          "labelFontSize": 10, "titleFontSize": 12, "titleFontWeight": "bold"
        }
      },
      "color": {
        "field": "School Type",
        "type": "nominal",
        "sort": ["Primary", "Secondary", "Combined"],
        "scale": {
          "domain": activeDomain,
          "range":  activeDomain.map(t => colorMap[t])
        },
        "legend": {
          "title": "School Type",
          "labelColor": "#3a2a10", "titleColor": "#3a2a10",
          "labelFontSize": 11, "titleFontSize": 11,
          "orient": "top-right"
        }
      },
      "tooltip": [
        { "field": "State",       "title": "State" },
        { "field": "School Type", "title": "School Type" },
        { "aggregate": "count",   "title": "Number of Schools" }
      ]
    },
    "config": {
      "view": { "stroke": null },
      "axis": { "domain": false, "ticks": false },
      "legend": { "padding": 6 }
    }
  };
  vegaEmbed("#vis-grouped-bar", spec, { actions: false });
}
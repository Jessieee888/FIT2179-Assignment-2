let selectedSectors = new Set(["Government", "Catholic", "Independent"]);

function toggleSector(sector, btn) {
  if (selectedSectors.has(sector)) {
    if (selectedSectors.size === 1) return;
    selectedSectors.delete(sector);
    btn.classList.remove("type-btn--active");
  } else {
    selectedSectors.add(sector);
    btn.classList.add("type-btn--active");
  }
  renderBar();
}

function renderBar() {
  const filtered = ALL_DATA.filter(d => selectedSectors.has(d["School Sector"]));

  const activeDomain = ["Government", "Catholic", "Independent"].filter(s => selectedSectors.has(s));
  const colorMap = { "Government": "#5a3e8a", "Catholic": "#e03e1a", "Independent": "#1a6a40" };

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
          "domain": activeDomain,
          "range":  activeDomain.map(s => colorMap[s])
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
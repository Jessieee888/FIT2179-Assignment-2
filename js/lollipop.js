function renderLollipop() {
  // Calculate % of non-government schools per state
  const stateTotals = {};
  const statePrivate = {};

  ALL_DATA.forEach(d => {
    const s = d["State"];
    if (!stateTotals[s]) { stateTotals[s] = 0; statePrivate[s] = 0; }
    stateTotals[s]++;
    if (d["School Sector"] !== "Government") statePrivate[s]++;
  });

  const values = Object.keys(stateTotals).map(state => ({
    State: state,
    Pct: parseFloat(((statePrivate[state] / stateTotals[state]) * 100).toFixed(1))
  }));

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 320,
    "background": "#f2ece0",
    "data": { "values": values },
    "layer": [
      {
        "mark": { "type": "rule", "color": "#c8b89a", "strokeWidth": 2 },
        "encoding": {
          "y": {
            "field": "State",
            "type": "nominal",
            "sort": { "field": "Pct", "order": "descending" },
            "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": null }
          },
          "x": {
            "value": 0
          },
          "x2": {
            "field": "Pct",
            "type": "quantitative"
          }
        }
      },
      {
        "mark": { "type": "circle", "size": 120, "color": "#5a3e8a" },
        "encoding": {
          "y": {
            "field": "State",
            "type": "nominal",
            "sort": { "field": "Pct", "order": "descending" },
            "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": null }
          },
          "x": {
            "field": "Pct",
            "type": "quantitative",
            "axis": {
              "labelColor": "#3a2a10",
              "titleColor": "#3a2a10",
              "title": "% Non-Government Schools",
              "gridColor": "#d8ccb0",
              "format": ".0f",
              "labelExpr": "datum.value + '%'"
            }
          },
          "tooltip": [
            { "field": "State", "title": "State" },
            { "field": "Pct",   "title": "% Non-Government Schools" }
          ]
        }
      }
    ],
    "config": { "view": { "stroke": null } }
  };
  vegaEmbed("#vis-lollipop", spec, { actions: false });
}
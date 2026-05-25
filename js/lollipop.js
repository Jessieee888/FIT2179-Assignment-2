function renderLollipop() {
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
    Pct: parseFloat(((statePrivate[state] / stateTotals[state]) * 100).toFixed(1)),
    PctLabel: ((statePrivate[state] / stateTotals[state]) * 100).toFixed(1) + "%",
    Zero: 0
  }));

  const sharedY = {
    "field": "State",
    "type": "nominal",
    "sort": { "field": "Pct", "order": "descending" },
    "axis": { "labelColor": "#3a2a10", "titleColor": "#3a2a10", "title": null }
  };

  const sharedXScale = { "domainMin": 0, "domainMax": 40 };

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 320,
    "background": "#f2ece0",
    "data": { "values": values },
    "layer": [
      {
        "mark": { "type": "rule", "strokeWidth": 2 },
        "encoding": {
          "y": sharedY,
          "x": {
            "field": "Zero",
            "type": "quantitative",
            "scale": sharedXScale,
            "axis": null
          },
          "x2": { "field": "Pct", "type": "quantitative" },
          "color": {
            "field": "State",
            "type": "nominal",
            "scale": {
              "domain": ["ACT","NSW","VIC","QLD","TAS","SA","WA","NT"],
              "range": ["#5a3e8a","#2a6a8a","#1a6a40","#8a6a1a","#8a3e20","#e03e1a","#3a7ab5","#6a1a6a"]
            },
            "legend": null
          }
        }
      },
      {
        "mark": { "type": "circle", "size": 250 },
        "encoding": {
          "y": sharedY,
          "x": {
            "field": "Pct",
            "type": "quantitative",
            "scale": sharedXScale,
            "axis": {
              "labelColor": "#3a2a10",
              "titleColor": "#3a2a10",
              "title": "% Non-Government Schools",
              "gridColor": "#d8ccb0",
              "labelExpr": "datum.value + '%'"
            }
          },
          "color": {
            "field": "State",
            "type": "nominal",
            "scale": {
              "domain": ["ACT","NSW","VIC","QLD","TAS","SA","WA","NT"],
              "range": ["#5a3e8a","#2a6a8a","#1a6a40","#8a6a1a","#8a3e20","#e03e1a","#3a7ab5","#6a1a6a"]
            },
            "legend": null
          },
          "tooltip": [
            { "field": "State",    "title": "State" },
            { "field": "PctLabel", "title": "% Non-Government Schools" }
          ]
        }
      },
      {
        "mark": { "type": "text", "align": "left", "dx": 10, "fontSize": 11, "fontStyle": "italic", "color": "#3a2a10" },
        "encoding": {
          "y": sharedY,
          "x": {
            "field": "Pct",
            "type": "quantitative",
            "scale": sharedXScale
          },
          "text": { "field": "PctLabel", "type": "nominal" }
        }
      }
    ],
    "config": { "view": { "stroke": null } }
  };
  vegaEmbed("#vis-lollipop", spec, { actions: false });
}
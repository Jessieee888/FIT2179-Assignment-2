function renderDivergingBar() {
  // Pre-computed from ACARA student numbers dataset 2025
  // All sectors, all levels, full-time + part-time combined
  const data = [
    { state: "ACT", male: 40113,  female: 37773,  male_pct: 51.50, female_pct: 48.50, deviation: 1.50 },
    { state: "NT",  male: 20517,  female: 19488,  male_pct: 51.29, female_pct: 48.71, deviation: 1.29 },
    { state: "WA",  male: 238647, female: 227638, male_pct: 51.18, female_pct: 48.82, deviation: 1.18 },
    { state: "SA",  male: 145434, female: 139125, male_pct: 51.11, female_pct: 48.89, deviation: 1.11 },
    { state: "VIC", male: 543996, female: 520542, male_pct: 51.10, female_pct: 48.90, deviation: 1.10 },
    { state: "QLD", male: 454526, female: 435109, male_pct: 51.09, female_pct: 48.91, deviation: 1.09 },
    { state: "NSW", male: 642207, female: 615523, male_pct: 51.06, female_pct: 48.94, deviation: 1.06 },
    { state: "TAS", male: 40763,  female: 39517,  male_pct: 50.78, female_pct: 49.22, deviation: 0.78 }
  ];

  // Flatten to two rows per state (one per gender) for back-to-back bars
  const flat = [];
  data.forEach(d => {
    flat.push({
      state: d.state, gender: "Male",
      x1: 50, x2: d.male_pct,
      pct: d.male_pct, count: d.male,
      deviation: d.deviation
    });
    flat.push({
      state: d.state, gender: "Female",
      x1: d.female_pct, x2: 50,
      pct: d.female_pct, count: d.female,
      deviation: d.deviation
    });
  });

  // State sort order (by deviation descending, already sorted in data array)
  const stateOrder = data.map(d => d.state);

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 320,
    "background": "#f2ece0",
    "data": { "values": flat },
    "layer": [
      {
        "mark": { "type": "bar", "height": 18 },
        "encoding": {
          "y": {
            "field": "state", "type": "ordinal",
            "sort": stateOrder,
            "axis": {
              "labelColor": "#3a2a10", "titleColor": "#3a2a10",
              "title": null, "labelFontSize": 12, "labelFontStyle": "italic"
            }
          },
          "x": {
            "field": "x1", "type": "quantitative",
            "scale": { "domain": [47.5, 52.5] },
            "axis": {
              "title": "Share of enrolments (%)",
              "titleColor": "#3a2a10", "labelColor": "#3a2a10",
              "gridColor": "#d8ccb0", "tickCount": 6,
              "labelExpr": "datum.value + '%'"
            }
          },
          "x2": { "field": "x2", "type": "quantitative" },
          "color": {
            "field": "gender", "type": "nominal",
            "scale": {
              "domain": ["Female", "Male"],
              "range":  ["#5a3e8a", "#e03e1a"]
            },
            "legend": {
              "title": "Gender",
              "titleColor": "#3a2a10", "labelColor": "#3a2a10",
              "orient": "top-right", "labelFontSize": 11
            }
          },
          "opacity": { "value": 0.82 },
          "tooltip": [
            { "field": "state",  "title": "State" },
            { "field": "gender", "title": "Gender" },
            { "field": "pct",    "title": "Share (%)",       "type": "quantitative", "format": ".2f" },
            { "field": "count",  "title": "Student Count",   "type": "quantitative", "format": "," }
          ]
        }
      },
      {
        "mark": { "type": "rule", "color": "#1a1209", "strokeWidth": 1.5, "strokeDash": [4, 2] },
        "encoding": {
          "x": { "datum": 50, "type": "quantitative" }
        }
      }
    ],
    "config": { "view": { "stroke": null }, "axis": { "domain": false } }
  };

  vegaEmbed("#vis-diverging-bar", spec, { actions: false });
}
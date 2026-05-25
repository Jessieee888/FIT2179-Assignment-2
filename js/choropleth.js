const STATE_NAME_MAP = {
  "NSW": "New South Wales",
  "VIC": "Victoria",
  "QLD": "Queensland",
  "WA":  "Western Australia",
  "SA":  "South Australia",
  "TAS": "Tasmania",
  "ACT": "Australian Capital Territory",
  "NT":  "Northern Territory"
};

function renderChoropleth() {
  // Count schools per state
  const counts = {};
  Object.values(STATE_NAME_MAP).forEach(n => counts[n] = 0);
  ALL_DATA.forEach(d => {
    const full = STATE_NAME_MAP[d["State"]];
    if (full) counts[full]++;
  });

  // Attach school_count at the TOP LEVEL of each feature (not nested under properties)
  // so Vega-Lite can access it directly without dot-notation issues
  const features = STATE_FEATURES
    .filter(f => f.geometry !== null && counts[f.properties.STE_NAME21] !== undefined)
    .map(f => ({
      ...f,
      school_count: counts[f.properties.STE_NAME21] || 0,
      state_name:   f.properties.STE_NAME21
    }));

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 480,
    "background": "#f2ece0",
    "data": { "values": features },
    "projection": { "type": "mercator", "center": [134, -28], "scale": 700 },
    "mark": {
      "type": "geoshape",
      "stroke": "#a89070",
      "strokeWidth": 0.8
    },
    "encoding": {
      "color": {
        "field": "school_count",
        "type": "quantitative",
        "scale": {
          "scheme": "oranges",
          "domain": [0, 3500]
        },
        "legend": {
          "title": "Number of Schools",
          "titleColor": "#3a2a10",
          "labelColor": "#3a2a10",
          "titleFontSize": 11,
          "labelFontSize": 10,
          "orient": "bottom-right",
          "gradientLength": 140
        }
      },
      "tooltip": [
        { "field": "state_name",   "title": "State",            "type": "nominal" },
        { "field": "school_count", "title": "Number of Schools", "type": "quantitative" }
      ]
    },
    "config": { "view": { "stroke": null } }
  };

  vegaEmbed("#vis-choropleth", spec, { actions: false });
}
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
  const counts = {};
  Object.values(STATE_NAME_MAP).forEach(name => counts[name] = 0);
  ALL_DATA.forEach(d => {
    const fullName = STATE_NAME_MAP[d["State"]];
    if (fullName) counts[fullName]++;
  });

  const enrichedFeatures = STATE_FEATURES
    .filter(f => f.geometry !== null && counts[f.properties.STE_NAME21] !== undefined)
    .map(f => {
      const count    = counts[f.properties.STE_NAME21] || 0;
      const areaSqKm = f.properties.AREASQKM21 || 1;
      const density  = (count / areaSqKm) * 1000;
      return {
        ...f,
        properties: {
          ...f.properties,
          school_count:   count,
          school_density: Math.round(density * 100) / 100
        }
      };
    });

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 480,
    "background": "#f2ece0",
    "data": { "values": enrichedFeatures },
    "projection": { "type": "mercator", "center": [134, -28], "scale": 700 },
    "mark": {
      "type": "geoshape",
      "stroke": "#a89070",
      "strokeWidth": 0.8
    },
    "encoding": {
      "color": {
        "field": "properties.school_density",
        "type": "quantitative",
        "scale": {
          "type": "quantile",
          "range": ["#fef0e6", "#fdd0a2", "#fdae6b", "#e6550d", "#a63603"]
        },
        "legend": {
          "title": "Schools per 1,000 km²",
          "titleColor": "#3a2a10",
          "labelColor": "#3a2a10",
          "titleFontSize": 11,
          "labelFontSize": 10,
          "orient": "bottom-right",
          "gradientLength": 120,
          "format": ".2f"
        }
      },
      "tooltip": [
        { "field": "properties.STE_NAME21",     "title": "State",                 "type": "nominal" },
        { "field": "properties.school_count",   "title": "Total Schools",         "type": "quantitative" },
        { "field": "properties.school_density", "title": "Schools per 1,000 km²", "type": "quantitative" }
      ]
    },
    "config": { "view": { "stroke": null } }
  };

  vegaEmbed("#vis-choropleth", spec, { actions: false });
}
function renderChoropleth() {
  const counts = {};
  Object.values(STATE_NAME_MAP).forEach(n => counts[n] = 0);
  ALL_DATA.forEach(d => {
    const full = STATE_NAME_MAP[d["State"]];
    if (full) counts[full]++;
  });

  let features = STATE_FEATURES
    .filter(f => f.geometry !== null && counts[f.properties.STE_NAME21] !== undefined)
    .map(f => {
      const count   = counts[f.properties.STE_NAME21] || 0;
      const area    = f.properties.AREASQKM21 || 1;
      const density = Math.round((count / area * 1000) * 100) / 100;
      return { ...f, properties: { ...f.properties, school_count: count, school_density: density } };
    });

  // Use a log or capped scale so ACT doesn't blow out the color ramp
  const densities = features.map(f => f.properties.school_density).sort((a, b) => a - b);
  const p90 = densities[Math.floor(densities.length * 0.9)] || densities[densities.length - 1];

  // Add a capped density for coloring purposes
  features = features.map(f => ({
    ...f,
    properties: {
      ...f.properties,
      density_capped: Math.min(f.properties.school_density, p90)
    }
  }));

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 480,
    "background": "#f2ece0",
    "data": {
      "values": features,
      "format": { "property": "features" }  // remove this line if features is already a flat array
    },
    "projection": {
      "type": "mercator",
      "center": [134, -28],
      "scale": 700
    },
    "mark": { "type": "geoshape", "stroke": "#a89070", "strokeWidth": 0.8 },
    "encoding": {
      "color": {
        "field": "properties.school_density",
        "type": "quantitative",
        "scale": {
          "type": "sqrt",           // sqrt scale compresses the ACT outlier
          "scheme": "oranges"
        },
        "legend": null
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

  // Legend
  const existing = document.getElementById("choropleth-legend");
  if (existing) existing.remove();

  const minD = densities[0];
  const maxD = densities[densities.length - 1];

  const legend = document.createElement("div");
  legend.id = "choropleth-legend";
  legend.innerHTML = `
    <span class="legend-label">Schools per 1,000 km² (density)</span>
    <div class="choropleth-gradient"></div>
    <div class="choropleth-legend-labels">
      <span>${minD.toFixed(2)} — low</span>
      <span>${maxD.toFixed(2)} — high</span>
    </div>`;
  document.getElementById("vis-choropleth").after(legend);
}
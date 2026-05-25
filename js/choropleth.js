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

const CHORO_RAMP = ["#fef0e6", "#fdd0a2", "#fdae6b", "#e6550d", "#a63603"];

function renderChoropleth() {
  // Count schools per state
  const counts = {};
  Object.values(STATE_NAME_MAP).forEach(n => counts[n] = 0);
  ALL_DATA.forEach(d => {
    const full = STATE_NAME_MAP[d["State"]];
    if (full) counts[full]++;
  });

  // Compute density per feature, filter to mainland states only
  let features = STATE_FEATURES
    .filter(f => f.geometry !== null && counts[f.properties.STE_NAME21] !== undefined)
    .map(f => {
      const count   = counts[f.properties.STE_NAME21] || 0;
      const area    = f.properties.AREASQKM21 || 1;
      const density = Math.round((count / area * 1000) * 100) / 100;
      return { ...f, properties: { ...f.properties, school_count: count, school_density: density } };
    });

  // Sort by density ascending, build explicit domain → color mapping
  const sorted = [...features].sort((a, b) =>
    a.properties.school_density - b.properties.school_density
  );

  const colorDomain = sorted.map(f => f.properties.STE_NAME21);
  const colorRange  = sorted.map((_, rank) =>
    CHORO_RAMP[Math.min(Math.floor((rank / sorted.length) * CHORO_RAMP.length), CHORO_RAMP.length - 1)]
  );

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 480,
    "background": "#f2ece0",
    "data": { "values": features },
    "projection": { "type": "mercator", "center": [134, -28], "scale": 700 },
    "mark": { "type": "geoshape", "stroke": "#a89070", "strokeWidth": 0.8 },
    "encoding": {
      "color": {
        "field": "properties.STE_NAME21",
        "type": "nominal",
        "scale": { "domain": colorDomain, "range": colorRange },
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

  // Custom gradient legend
  const existing = document.getElementById("choropleth-legend");
  if (existing) existing.remove();

  const minD = sorted[0].properties.school_density;
  const maxD = sorted[sorted.length - 1].properties.school_density;

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
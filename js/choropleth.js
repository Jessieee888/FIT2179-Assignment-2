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

  // Compute density per feature
  let features = STATE_FEATURES
    .filter(f => f.geometry !== null && counts[f.properties.STE_NAME21] !== undefined)
    .map(f => {
      const count   = counts[f.properties.STE_NAME21] || 0;
      const area    = f.properties.AREASQKM21 || 1;
      const density = Math.round((count / area * 1000) * 100) / 100;
      return { ...f, properties: { ...f.properties, school_count: count, school_density: density } };
    });

  // Rank-based quintile colour assignment in JS, bypasses Vega-Lite scale entirely
  const RAMP = ["#fef0e6", "#fdd0a2", "#fdae6b", "#e6550d", "#a63603"];
  const sorted = features.map(f => f.properties.school_density).sort((a, b) => a - b);

  features = features.map(f => {
    const rank     = sorted.indexOf(f.properties.school_density);
    const colourIdx = Math.min(Math.floor((rank / sorted.length) * RAMP.length), RAMP.length - 1);
    return { ...f, properties: { ...f.properties, fill_color: RAMP[colourIdx] } };
  });

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
        "field": "properties.fill_color",
        "type": "nominal",
        "scale": null,
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

  // Inject custom legend since Vega-Lite legend is bypassed
  const minD = Math.min(...features.map(f => f.properties.school_density));
  const maxD = Math.max(...features.map(f => f.properties.school_density));

  const existing = document.getElementById("choropleth-legend");
  if (existing) existing.remove();

  const legend = document.createElement("div");
  legend.id = "choropleth-legend";
  legend.innerHTML = `
    <span class="legend-label">Schools per 1,000 km²</span>
    <div class="choropleth-gradient"></div>
    <div class="choropleth-legend-labels">
      <span>${minD.toFixed(2)} (low)</span>
      <span>${maxD.toFixed(2)} (high)</span>
    </div>`;
  document.getElementById("vis-choropleth").after(legend);
}
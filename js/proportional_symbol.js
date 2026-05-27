function renderPropSymbol() {
  // School counts and areas per state
  const STATE_DATA = [
    { state: "New South Wales",           abbr: "NSW", lon: 150.05, lat: -32.83 },
    { state: "Victoria",                  abbr: "VIC", lon: 145.47, lat: -36.56 },
    { state: "Queensland",                abbr: "QLD", lon: 145.77, lat: -19.20 },
    { state: "Western Australia",         abbr: "WA",  lon: 120.96, lat: -24.46 },
    { state: "South Australia",           abbr: "SA",  lon: 135.00, lat: -32.03 },
    { state: "Tasmania",                  abbr: "TAS", lon: 146.15, lat: -41.43 },
    { state: "Australian Capital Territory", abbr: "ACT", lon: 149.05, lat: -35.53 },
    { state: "Northern Territory",        abbr: "NT",  lon: 133.50, lat: -18.45 }
  ];

  const ABBR_MAP = {
    "NSW": "New South Wales", "VIC": "Victoria", "QLD": "Queensland",
    "WA": "Western Australia", "SA": "South Australia", "TAS": "Tasmania",
    "ACT": "Australian Capital Territory", "NT": "Northern Territory"
  };

  // Count schools per state from ALL_DATA
  const counts = {};
  ALL_DATA.forEach(d => {
    const full = ABBR_MAP[d["State"]];
    if (full) counts[full] = (counts[full] || 0) + 1;
  });

  // Get area from STATE_FEATURES
  const areas = {};
  STATE_FEATURES.forEach(f => {
    if (f.properties && f.properties.AREASQKM21)
      areas[f.properties.STE_NAME21] = f.properties.AREASQKM21;
  });

  // Build symbol data: density = schools per 1,000 km²
  const symbolData = STATE_DATA.map(d => ({
    ...d,
    school_count:   counts[d.state] || 0,
    area_km2:       Math.round(areas[d.state] || 1),
    density:        Math.round(((counts[d.state] || 0) / (areas[d.state] || 1)) * 1000 * 100) / 100
  }));

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 520,
    "background": "#f2ece0",
    "layer": [
      {
        "data": {
          "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
          "format": { "type": "topojson", "feature": "countries" }
        },
        "projection": { "type": "mercator", "center": [134, -28], "scale": 700 },
        "mark": { "type": "geoshape", "fill": "#e8dfc8", "stroke": "#a89070", "strokeWidth": 0.6 }
      },
      {
        "data": { "values": STATE_FEATURES.filter(f => f.geometry !== null) },
        "projection": { "type": "mercator", "center": [134, -28], "scale": 700 },
        "mark": {
          "type": "geoshape",
          "fill": "transparent",
          "stroke": "#7a5c30",
          "strokeWidth": 1.0,
          "strokeDash": [4, 2]
        }
      },
      {
        "data": { "values": symbolData },
        "projection": { "type": "mercator", "center": [134, -28], "scale": 700 },
        "mark": {
          "type": "circle",
          "opacity": 0.55,
          "stroke": "#8a4a00",
          "strokeWidth": 1,
          "strokeOpacity": 0.8
        },
        "encoding": {
          "longitude": { "field": "lon", "type": "quantitative" },
          "latitude":  { "field": "lat", "type": "quantitative" },
          "size": {
            "field": "density",
            "type": "quantitative",
            "scale": { "type": "sqrt", "range": [80, 6000] },
            "legend": {
              "title": "Schools per 1,000 km²",
              "titleColor": "#3a2a10",
              "labelColor": "#3a2a10",
              "titleFontSize": 11,
              "labelFontSize": 10,
              "orient": "bottom-left"
            }
          },
          "color": { "value": "#e03e1a" },
          "tooltip": [
            { "field": "state",        "title": "State" },
            { "field": "school_count", "title": "Total Schools",         "type": "quantitative" },
            { "field": "area_km2",     "title": "Area (km²)",            "type": "quantitative", "format": "," },
            { "field": "density",      "title": "Schools per 1,000 km²", "type": "quantitative" }
          ]
        }
      }
    ],
    "config": { "view": { "stroke": null } }
  };

  vegaEmbed("#vis-prop-symbol", spec, { actions: false }).then(() => {
    const container = document.getElementById("vis-prop-symbol");
    document.querySelectorAll("#vis-prop-symbol .map-annotation").forEach(el => el.remove());

    const div = document.createElement("div");
    div.className = "map-annotation";
    div.style.left = "80%";
    div.style.top  = "68%";
    div.innerHTML  = `<div class="map-annotation-bubble">ACT: 91 schools per 1,000 km²<br><span style="font-size:0.62rem;opacity:0.8">Tiny area, fully urban, by far the densest</span></div>`;
    container.appendChild(div);
  });
}
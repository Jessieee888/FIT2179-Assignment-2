function renderPropSymbol() {
  const STATE_DATA = [
    { state: "New South Wales",              abbr: "NSW", lon: 150.05, lat: -32.83 },
    { state: "Victoria",                     abbr: "VIC", lon: 145.47, lat: -36.56 },
    { state: "Queensland",                   abbr: "QLD", lon: 145.77, lat: -19.20 },
    { state: "Western Australia",            abbr: "WA",  lon: 120.96, lat: -24.46 },
    { state: "South Australia",              abbr: "SA",  lon: 135.00, lat: -32.03 },
    { state: "Tasmania",                     abbr: "TAS", lon: 146.15, lat: -41.43 },
    { state: "Australian Capital Territory", abbr: "ACT", lon: 149.05, lat: -35.53 },
    { state: "Northern Territory",           abbr: "NT",  lon: 133.50, lat: -18.45 }
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
    school_count: counts[d.state] || 0,
    area_km2:     Math.round(areas[d.state] || 1),
    density:      Math.round(((counts[d.state] || 0) / (areas[d.state] || 1)) * 1000 * 100) / 100
  }));

  fetch("vega/proportional_symbol.json")
    .then(r => r.json())
    .then(spec => {
      // Inject live data into the two placeholder layers
      spec.layer[1].data.values = STATE_FEATURES.filter(f => f.geometry !== null);
      spec.layer[2].data.values = symbolData;

      return vegaEmbed("#vis-prop-symbol", spec, { actions: false });
    })
    .then(() => {
      const container = document.getElementById("vis-prop-symbol");
      document.querySelectorAll("#vis-prop-symbol .map-annotation").forEach(el => el.remove());

      const div = document.createElement("div");
      div.className = "map-annotation";
      div.style.left = "77%";
      div.style.top  = "68%";
      div.innerHTML  = `<div class="map-annotation-bubble">ACT: 91 schools per 1,000 km²<br><span style="font-size:0.62rem;opacity:0.8">Tiny area, fully urban, by far the densest</span></div>`;
      container.appendChild(div);
    });
}
function renderChoropleth() {
  // Count schools per state from ALL_DATA
  const stateCounts = {};
  ALL_DATA.forEach(d => {
    const s = d["State"];
    if (s) stateCounts[s] = (stateCounts[s] || 0) + 1;
  });

  // State name → abbr + area (km²)
  const stateInfo = {
    "New South Wales":            { abbr: "NSW", area: 800797.66 },
    "Victoria":                   { abbr: "VIC", area: 227496.25 },
    "Queensland":                 { abbr: "QLD", area: 1730171.22 },
    "South Australia":            { abbr: "SA",  area: 984231.42 },
    "Western Australia":          { abbr: "WA",  area: 2526632.48 },
    "Tasmania":                   { abbr: "TAS", area: 68017.54 },
    "Northern Territory":         { abbr: "NT",  area: 1348134.49 },
    "Australian Capital Territory":{ abbr: "ACT", area: 2358.13 }
  };

  // Build lookup: full name → density
  const densityLookup = {};
  Object.entries(stateInfo).forEach(([name, info]) => {
    const count = stateCounts[info.abbr] || 0;
    densityLookup[name] = {
      density: parseFloat((count / info.area * 1000).toFixed(3)),
      count: count,
      abbr: info.abbr
    };
  });

  // Inject density into GeoJSON features
  fetch("data/state_boundaries.json")
    .then(r => r.json())
    .then(geojson => {
      geojson.features.forEach(f => {
        const name = f.properties.STE_NAME21;
        const info = densityLookup[name];
        if (info) {
          f.properties.density = info.density;
          f.properties.count   = info.count;
          f.properties.abbr    = info.abbr;
        } else {
          f.properties.density = null;
        }
      });

      // Filter out non-state features
      geojson.features = geojson.features.filter(f => f.properties.density !== null && f.properties.density !== undefined);

      const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": "container",
        "height": 480,
        "background": "#f2ece0",
        "projection": { "type": "mercator", "center": [134, -28], "scale": 700 },
        "layer": [
          {
            "data": {
              "url": "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
              "format": { "type": "topojson", "feature": "countries" }
            },
            "mark": {
              "type": "geoshape",
              "fill": "#e8dfc8",
              "stroke": "#a89070",
              "strokeWidth": 0.5
            }
          },
          {
            "data": { "values": geojson.features, "format": { "type": "json", "property": "features" } },
            "mark": { "type": "geoshape", "stroke": "#f2ece0", "strokeWidth": 1 },
            "encoding": {
              "color": {
                "field": "properties.density",
                "type": "quantitative",
                "scale": { "scheme": "oranges" },
                "legend": {
                  "title": "Schools per 1,000 km²",
                  "labelColor": "#3a2a10",
                  "titleColor": "#3a2a10"
                }
              },
              "tooltip": [
                { "field": "properties.abbr",    "title": "State" },
                { "field": "properties.count",   "title": "Total Schools" },
                { "field": "properties.density", "title": "Schools per 1,000 km²" }
              ]
            }
          }
        ],
        "config": { "view": { "stroke": null } }
      };

      vegaEmbed("#vis-choropleth", spec, { actions: false });
    });
}
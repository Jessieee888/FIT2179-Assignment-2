// Color schemes (keyed by new JSON field names)
const COLORS = {
  "sector": {
    label:  "Sector",
    domain: ["Government", "Catholic", "Independent"],
    range:  ["#5a3e8a", "#8a3e20", "#1a6a40"]
  },
  "type": {
    label:  "School type",
    domain: ["Primary", "Secondary", "Combined"],
    range:  ["#2a5a8a", "#8a2a50", "#5a6a1a"]
  },
  "remoteness": {
    label:  "Remoteness",
    domain: ["Major Cities", "Inner Regional", "Outer Regional", "Remote", "Very Remote"],
    range:  ["#1a1a5a", "#2a6a2a", "#8a6a1a", "#8a3a1a", "#6a1a1a"]
  }
};

let ALL_DATA = [];

// Load data
fetch("data/schools.json")
  .then(r => r.json())
  .then(data => {
    ALL_DATA = data;
    applyFilters();
    renderBar();
  })
  .catch(err => console.error("Failed to load schools.json:", err));

// Apply filters & re-render map
function applyFilters() {
  const sec   = document.getElementById("sel-sector").value;
  const typ   = document.getElementById("sel-type").value;
  const state = document.getElementById("sel-state").value;
  const col   = document.getElementById("sel-color").value;   // "sector" | "type" | "remoteness"

  const data = ALL_DATA.filter(d =>
    (!sec   || d.sector     === sec)   &&
    (!typ   || d.type       === typ)   &&
    (!state || d.state      === state)
  );

  updateStats(data);
  updateLegend(col);
  renderMap(data, col);
}

// Stats counters
function updateStats(data) {
  document.getElementById("s-total").textContent = data.length.toLocaleString();
  document.getElementById("s-gov").textContent   = data.filter(d => d.sector === "Government").length.toLocaleString();
  document.getElementById("s-cath").textContent  = data.filter(d => d.sector === "Catholic").length.toLocaleString();
  document.getElementById("s-ind").textContent   = data.filter(d => d.sector === "Independent").length.toLocaleString();
}

// Legend
function updateLegend(colorField) {
  const c = COLORS[colorField];
  document.getElementById("legend-label").textContent = c.label;
  document.getElementById("legend").innerHTML = c.domain.map((k, i) =>
    `<div class="legend-item">
       <div class="legend-dot" style="background:${c.range[i]}"></div>
       ${k}
     </div>`
  ).join("");
}

// Map
function renderMap(data, colorField) {
  const c = COLORS[colorField];

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
        "data": { "values": data },
        "projection": { "type": "mercator", "center": [134, -28], "scale": 700 },
        "mark": { "type": "circle", "opacity": 0.75, "size": 9 },
        "encoding": {
          "longitude": { "field": "lon",        "type": "quantitative" },
          "latitude":  { "field": "lat",         "type": "quantitative" },
          "color": {
            "field": colorField,
            "type": "nominal",
            "scale": { "domain": c.domain, "range": c.range },
            "legend": null
          },
          "tooltip": [
            { "field": "name",       "title": "School"      },
            { "field": "sector",     "title": "Sector"      },
            { "field": "type",       "title": "Type"        },
            { "field": "state",      "title": "State"       },
            { "field": "remoteness", "title": "Remoteness"  }
          ]
        }
      }
    ],
    "config": { "view": { "stroke": null } }
  };

  vegaEmbed("#vis", spec, { actions: false });
}

// Stacked bar chart
function renderBar() {
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "background": "#f2ece0",
    "data": { "values": ALL_DATA },
    "mark": { "type": "bar" },
    "encoding": {
      "x": {
        "field": "state",
        "type": "nominal",
        "sort": "-y",
        "axis": {
          "labelFont": "Source Serif 4",
          "titleFont": "Source Serif 4",
          "labelColor": "#3a2a10",
          "titleColor": "#3a2a10",
          "title": "State"
        }
      },
      "y": {
        "aggregate": "count",
        "type": "quantitative",
        "stack": "zero",
        "axis": {
          "labelFont": "Source Serif 4",
          "titleFont": "Source Serif 4",
          "labelColor": "#3a2a10",
          "titleColor": "#3a2a10",
          "title": "Number of Schools",
          "gridColor": "#d8ccb0"
        }
      },
      "color": {
        "field": "sector",
        "type": "nominal",
        "scale": {
          "domain": ["Government", "Catholic", "Independent"],
          "range":  ["#5a3e8a", "#8a3e20", "#1a6a40"]
        },
        "legend": {
          "title": "Sector",
          "labelFont": "Source Serif 4",
          "titleFont": "Source Serif 4",
          "labelColor": "#3a2a10",
          "titleColor": "#3a2a10"
        }
      },
      "tooltip": [
        { "field": "state",  "title": "State"             },
        { "field": "sector", "title": "Sector"            },
        { "aggregate": "count", "title": "Number of Schools" }
      ]
    },
    "config": { "view": { "stroke": null } }
  };

  vegaEmbed("#vis-bar", spec, { actions: false });
}
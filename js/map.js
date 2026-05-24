const COLORS = {
  "School Sector": {
    domain: ["Government", "Catholic", "Independent"],
    range:  ["#5a3e8a", "#e03e1a", "#1a6a40"]
  },
  "School Type": {
    domain: ["Primary", "Secondary", "Combined"],
    range:  ["#0097a7", "#982654", "#a87cc9"]
  },
  "Area Remoteness": {
    domain: ["Major Cities", "Inner Regional", "Outer Regional", "Remote", "Very Remote"],
    range:  ["#4f83b5","#76a96b","#d98abc","#e8c981","#8a3f3f"]
  }
};

let ALL_DATA = [];

fetch("data/schools.csv")
  .then(r => r.text())
  .then(text => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");
    ALL_DATA = lines.slice(1).map(line => {
      const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = cols[i] ? cols[i].replace(/^"|"$/g, "").trim() : "";
      });
      return obj;
    });
    applyFilters();
    renderBar();
    renderRemoteBar();
    renderHeatmap();
  });

function applyFilters() {
  const sec   = document.getElementById("sel-sector").value;
  const typ   = document.getElementById("sel-type").value;
  const state = document.getElementById("sel-state").value;
  const col   = document.getElementById("sel-color").value;

  const data = ALL_DATA.filter(d =>
    (!sec   || d["School Sector"] === sec)  &&
    (!typ   || d["School Type"]   === typ)  &&
    (!state || d["State"]         === state)
  );

  updateStats(data);
  updateLegend(col);
  renderMap(data, col);
}

function updateStats(data) {
  document.getElementById("s-total").textContent = data.length.toLocaleString();
  document.getElementById("s-gov").textContent   = data.filter(d => d["School Sector"] === "Government").length.toLocaleString();
  document.getElementById("s-cath").textContent  = data.filter(d => d["School Sector"] === "Catholic").length.toLocaleString();
  document.getElementById("s-ind").textContent   = data.filter(d => d["School Sector"] === "Independent").length.toLocaleString();
}

function updateLegend(colorField) {
  const c = COLORS[colorField];
  document.getElementById("legend-label").textContent =
    colorField.charAt(0).toUpperCase() + colorField.slice(1);
  document.getElementById("legend").innerHTML = c.domain.map((k, i) =>
    `<div class="legend-item">
       <div class="legend-dot" style="background:${c.range[i]}"></div>
       ${k}
     </div>`
  ).join("");
}

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
          "longitude": { "field": "Longitude", "type": "quantitative" },
          "latitude":  { "field": "Latitude",  "type": "quantitative" },
          "color": {
            "field": colorField,
            "type": "nominal",
            "scale": { "domain": c.domain, "range": c.range },
            "legend": null
          },
          "tooltip": [
            { "field": "School Name",             "title": "School" },
            { "field": "School Sector",           "title": "Sector" },
            { "field": "School Type",             "title": "Type" },
            { "field": "State",                   "title": "State" },
            { "field": "ABS Remoteness Area Name","title": "Remoteness" }
          ]
        }
      }
    ],
    "config": { "view": { "stroke": null } }
  };
  vegaEmbed("#vis", spec, { actions: false });
}
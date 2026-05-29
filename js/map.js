const COLORS = {
  "School Sector": {
    domain: ["Government", "Catholic", "Independent"],
    range:  ["#5a3e8a", "#e03e1a", "#1a6a40"]
  },
  "School Type": {
    domain: ["Primary", "Secondary", "Combined"],
    range:  ["#008b8b", "#ca8d7f", "#1c1d87"]
  },
  "ABS Remoteness Area Name": {
    domain: ["Major Cities", "Inner Regional", "Outer Regional", "Remote", "Very Remote"],
    range:  ["#4f83b5","#76a96b","#d98abc","#e8c981","#8a3f3f"]
  }
};

// center [lon, lat] and scale per state
const STATE_VIEW = {
  "":    { center: [134, -28],      scale: 700   },
  "NSW": { center: [146, -32],      scale: 1600  },
  "VIC": { center: [144.5, -37],   scale: 2400  },
  "QLD": { center: [144, -22],      scale: 800   },
  "WA":  { center: [122, -26],      scale: 560   },
  "SA":  { center: [135.5, -30],   scale: 870   },
  "TAS": { center: [146.5, -42],   scale: 3800  },
  "ACT": { center: [149.1, -35.5], scale: 10000 },
  "NT":  { center: [133.5, -20],   scale: 870   }
};

let ALL_DATA      = [];
let STATE_FEATURES = [];
let MAP_SPEC_TEMPLATE = null; // cached after first fetch

Promise.all([
  fetch("data/schools.csv").then(r => r.text()),
  fetch("data/state_boundaries.json").then(r => r.json()),
  fetch("vega/map.json").then(r => r.json())
]).then(([csvText, geoJson, mapSpec]) => {
  const lines   = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  ALL_DATA = lines.slice(1).map(line => {
    const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    const obj  = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] ? cols[i].replace(/^"|"$/g, "").trim() : "";
    });
    return obj;
  });

  STATE_FEATURES        = geoJson.features;
  MAP_SPEC_TEMPLATE     = mapSpec;

  applyFilters();
  renderBar();
  renderRemoteBar();
  renderHeatmap();
  renderGroupedBar();
  renderDonutChart();
  renderLollipop();
  renderPropSymbol();
  renderSmallMultiples();
  renderLineChart();
  renderDivergingBar();
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
  renderMap(data, col, state);
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

function renderMap(data, colorField, selectedState = "") {
  const c    = COLORS[colorField];
  const view = STATE_VIEW[selectedState] || STATE_VIEW[""];

  // Deep clone so each call gets a fresh spec never mutate MAP_SPEC_TEMPLATE directly
  const spec = JSON.parse(JSON.stringify(MAP_SPEC_TEMPLATE));

  // Inject projection into all three layers
  const projection = { "type": "mercator", "center": view.center, "scale": view.scale };
  spec.layer[0].projection = projection;
  spec.layer[1].projection = projection;
  spec.layer[2].projection = projection;

  // Inject data
  spec.layer[1].data.values = STATE_FEATURES.filter(f => f.geometry !== null && f.properties.STE_NAME21 !== "Other Territories");
  spec.layer[2].data.values = data;

  // Inject dynamic color encoding
  spec.layer[2].encoding.color.field        = colorField;
  spec.layer[2].encoding.color.scale.domain = c.domain;
  spec.layer[2].encoding.color.scale.range  = c.range;

  vegaEmbed("#vis", spec, { actions: false }).then(() => {
    // Remove old annotations
    document.querySelectorAll(".map-annotation").forEach(el => el.remove());

    // Only show annotation on full Australia view
    if (selectedState !== "") return;

    const container = document.getElementById("vis");
    const div       = document.createElement("div");
    div.className   = "map-annotation";
    div.style.left  = "80%";
    div.style.top   = "55%";
    div.innerHTML   = `<div class="map-annotation-bubble">Schools crowd the southeast coast</div>`;
    container.appendChild(div);
  });
}